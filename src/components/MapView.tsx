import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Assuming this file exists and contains global config if needed.
// import "../lib/leaflet-config"; 

// Interfaces and data remain the same
interface GlacierLocation {
  id: number;
  name: string;
  risk: "safe" | "watch" | "danger";
  lat: number;
  lng: number;
  riskScore: number;
}

interface MapViewProps {
  onLocationSelect: (location: GlacierLocation) => void;
}

const glacierLocations: GlacierLocation[] = [
  { id: 1, name: "Imja Glacial Lake", risk: "danger", lat: 27.898, lng: 86.928, riskScore: 8.5 },
  { id: 2, name: "Tsho Rolpa Lake", risk: "watch", lat: 27.862, lng: 86.477, riskScore: 6.2 },
  { id: 3, name: "Thulagi Lake", risk: "safe", lat: 28.486, lng: 84.485, riskScore: 2.1 },
];

const getRiskColor = (risk: GlacierLocation["risk"]): string => {
  switch (risk) {
    case "safe": return "#22c55e";
    case "watch": return "#f97316";
    case "danger": return "#ef4444";
    default: return "#94a3b8";
  }
};

const createIcon = (color: string): L.Icon =>
  L.icon({
    iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(color)}' width='28' height='28'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

export const MapView: React.FC<MapViewProps> = ({ onLocationSelect }) => {

  useEffect(() => {
    // This effect runs only once after the component mounts.
    // This is the correct place to handle global side effects like icon fixes.
    console.log("MapView component mounted. Initializing Leaflet icon paths.");
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    // You can also place other one-time Leaflet configurations here.
  }, []); // The empty dependency array ensures this effect runs only once.

  console.log("MapView is rendering...");
  
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer
        center={[27.898, 86.928]}
        zoom={9}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {glacierLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createIcon(getRiskColor(location.risk))}
            eventHandlers={{
              click: () => onLocationSelect(location),
            }}
          >
            <Popup>
              <div className="font-medium">{location.name}</div>
              <div className="text-sm">Risk: {location.risk}</div>
              <div className="text-sm">Score: {location.riskScore}/10</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;