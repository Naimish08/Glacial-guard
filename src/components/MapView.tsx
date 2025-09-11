import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// The props are not needed for this simplified version, but we can keep the interface for future use.
interface MapViewProps {
  onLocationSelect: (location: any) => void;
}

export const MapView: React.FC<MapViewProps> = () => {
  const defaultCenter: [number, number] = [27.898, 86.928];
  const defaultZoom = 9;

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default MapView;