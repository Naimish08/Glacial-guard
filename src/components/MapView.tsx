import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, Marker, Popup, useMap, Circle } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { himalayanRegions, floodCorridors } from "./geojson";
import { realTimeAlerts } from './AlertsSection';
import { Icon } from 'leaflet';
import { Feature, GeoJsonObject } from "geojson";
import { Layer, PathOptions } from "leaflet";
import { cn } from "@/lib/utils";
import L from "leaflet";

// Demo village data (some inside, some outside glacier circles)
const villages = [
  { name: "Phortse", coords: [27.893, 86.771] },      // Inside Khumbu
  { name: "Dingboche", coords: [27.893, 86.831] },    // Inside Khumbu
  { name: "Lukla", coords: [27.688, 86.731] },        // Outside circles
  { name: "Thangu", coords: [27.900, 88.600] },       // Outside circles
  { name: "Gokyo", coords: [27.954, 86.695] },        // Near Ngozumpa
  { name: "Gangotri", coords: [30.990, 79.080] },     // Near Gangotri Glacier

  { name: "Batal", coords: [32.300, 77.600] },
  { name: "Chitkul", coords: [31.300, 78.400] },
  { name: "Tandi", coords: [32.500, 77.100] },
  { name: "Padum", coords: [33.500, 76.800] },
  { name: "Lobuche", coords: [27.940, 86.810] },
  { name: "Rongbuk Monastery", coords: [28.100, 86.860] },
  { name: "Warshi", coords: [35.200, 77.300] },
  { name: "Sonamarg", coords: [34.300, 75.290] },
  { name: "Jankichatti", coords: [31.010, 78.450] },
  { name: "Khati", coords: [30.080, 79.990] },
  { name: "Bugdiyar", coords: [30.290, 80.050] },
  { name: "Mana", coords: [30.740, 79.490] },
  { name: "Chhatru", coords: [32.300, 77.200] },
  { name: "Bukki", coords: [30.800, 78.600] },
  { name: "Rattu Cantonment", coords: [35.100, 75.000] },
  { name: "Aru", coords: [34.010, 75.140] },
  { name: "Kugti", coords: [32.590, 76.620] }
];


const villageIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3e1.png", // 🏡 emoji as icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Separate component for handling map updates
const MapUpdater = ({ onPanToLocation }: { onPanToLocation?: [number, number] }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (onPanToLocation) {
      map.setView(onPanToLocation, 13);
    }
  }, [map, onPanToLocation]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({ 
  onLocationSelect, 
  selectedLocation,
  onPanToLocation 
}) => {
  const mapRef = useRef<any>(null);

  const defaultCenter: [number, number] = [27.9, 86.9]; // Centered on Himalayan region
  const defaultZoom = 9;

  const getLakeStyle = (feature?: Feature): PathOptions => {
    const status = feature?.properties?.status || "default";
    
    return {
      fillColor: `hsl(var(--${status}))`,
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: status === "watch" ? "5, 5" : "0",
      fillOpacity: 0.7,
      className: cn(
        "transition-all duration-300",
        status === "danger" && "animate-pulse-glow",
        status === "watch" && "glacial-watch-pattern"
      )
    };
  };

  const getFloodPathStyle = (feature?: Feature): PathOptions => {
    return {
      fillColor: "hsl(195 85% 50% / 0.3)",
      weight: 1,
      opacity: 0.8,
      color: "hsl(195 85% 50% / 0.5)",
      fillOpacity: 0.3,
      className: "flood-path-gradient"
    };
  };

  const onEachLake = (feature: Feature, layer: Layer) => {
    if (feature.properties) {
      const props = feature.properties;
      const status = props.status;
      const statusIcon = status === 'safe' ? '✅' : 
                        status === 'watch' ? '⚠️' : '🚨';
      
      layer.bindTooltip(`
        <div class="p-2">
          <div class="font-bold">${statusIcon} ${props.name}</div>
          <div class="text-sm">Risk Score: ${props.riskScore}/10</div>
          <div class="text-xs">${props.elevation} • ${props.country}</div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        className: 'bg-card/95 border border-border rounded-md shadow-md'
      });

      // Highlight selected feature
      if (selectedLocation === props.name) {
        layer.setStyle({
          weight: 3,
          color: "hsl(var(--primary))",
          fillOpacity: 0.8
        });
      }

      // Click handler
      layer.on('click', () => {
        onLocationSelect({
          id: feature.id,
          name: props.name,
          risk: props.status,
          riskScore: props.riskScore,
          elevation: props.elevation,
          country: props.country,
          riskFactors: props.riskFactors,
          lastUpdated: props.lastUpdated,
          area: props.area,
          volume: props.volume,
          temperature: props.temperature,
          morainCondition: props.morainCondition,
          coordinates: feature.geometry.type === 'Polygon' ? feature.geometry.coordinates[0][0] : undefined
        });
      });
    }
  };

  // Create custom marker icon
  const customIcon = new Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Helper to get color based on status
  const getStatusColor = (status: string) => {
    if (status === "danger") return "#e53935";   // Bright red
    if (status === "watch") return "#ffb300";    // Bright orange
    if (status === "safe") return "#43a047";     // Bright green
    return "#757575";                            // Gray
  };

  // Render circles for each glacier
  const glacierCircles = (himalayanRegions as any).features.map((feature: any) => {
    const center = feature.properties.center;
    const radius = feature.properties.radius ? feature.properties.radius * 3: 6000; // Double the radius or set to 6000m
    const status = feature.properties.status;
    const color = getStatusColor(status);

    return (
      <Circle
        key={feature.properties.name}
        center={center}
        radius={radius}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 0.5,
          weight: 3,
        }}
        eventHandlers={{
          click: () => onLocationSelect({
            name: feature.properties.name,
            risk: status,
            ...feature.properties
          })
        }}
      >
        <Popup>
          <div>
            <h3>{feature.properties.name}</h3>
            <p>Risk Score: {feature.properties.riskScore}</p>
            <p>Status: {status}</p>
          </div>
        </Popup>
      </Circle>
    );
  });

  return (
    <div className="w-full h-full relative">
      <MapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayersControl position="topright">
          {/* Remove or comment out the Glacial Lakes GeoJSON */}
          {/* <LayersControl.Overlay name="Glacial Lakes" checked>
            <GeoJSON 
              data={himalayanRegions as GeoJsonObject}
              style={getLakeStyle}
              onEachFeature={onEachLake}
            />
          </LayersControl.Overlay> */}
          <LayersControl.Overlay name="Flood Corridors" checked>
            <GeoJSON
              data={floodCorridors as GeoJsonObject}
              style={getFloodPathStyle}
            />
          </LayersControl.Overlay>
        </LayersControl>

        {/* Render glacier circles */}
        {glacierCircles}

        {/* Render village markers */}
        {villages.map((village) => (
          <Marker
            key={village.name}
            position={village.coords}
            icon={villageIcon}
          >
            <Popup>
              <strong>{village.name}</strong>
            </Popup>
          </Marker>
        ))}

        {/* Legend */}
        <div className="absolute bottom-5 right-5 bg-card/95 p-3 rounded-lg shadow-md border border-border">
          <h4 className="font-medium mb-2">Risk Levels</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-safe"></span>
              <span>Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-watch"></span>
              <span>Watch</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-danger animate-pulse"></span>
              <span>Danger</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary/30"></span>
              <span>Flood Path</span>
            </div>
          </div>
        </div>

        <MapUpdater onPanToLocation={onPanToLocation} />
      </MapContainer>
    </div>
  );
};

export default MapView;