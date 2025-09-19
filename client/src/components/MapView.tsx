import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { himalayanRegions, floodCorridors } from "./geojson";
import { realTimeAlerts } from './AlertsSection';
import { Icon } from 'leaflet';
import { Feature, GeoJsonObject } from "geojson";
import { Layer, PathOptions } from "leaflet";
import { cn } from "@/lib/utils";

interface MapViewProps {
  onLocationSelect: (location: any) => void;
  selectedLocation?: string;
  onPanToLocation?: [number, number];
}

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
          <LayersControl.Overlay name="Glacial Lakes" checked>
            <GeoJSON 
              data={himalayanRegions as GeoJsonObject}
              style={getLakeStyle}
              onEachFeature={onEachLake}
            />
          </LayersControl.Overlay>
          
          <LayersControl.Overlay name="Flood Corridors" checked>
            <GeoJSON
              data={floodCorridors as GeoJsonObject}
              style={getFloodPathStyle}
            />
          </LayersControl.Overlay>
        </LayersControl>

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

        {realTimeAlerts.map((alert) => (
          <Marker
            key={alert.id}
            position={alert.coordinates}
            icon={customIcon}
            eventHandlers={{
              click: () => onLocationSelect({
                name: alert.lakeName,
                id: alert.lakeId,
                risk: alert.riskScore
              })
            }}
          >
            <Popup>
              <div>
                <h3>{alert.lakeName}</h3>
                <p>Risk Score: {alert.riskScore}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;