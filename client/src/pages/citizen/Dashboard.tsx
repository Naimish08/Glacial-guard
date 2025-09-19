import { useState } from "react";
import { Navigation } from "../../components/citizen/Navigation";
import { AlertPanel } from "../../components/citizen/AlertPanel";
import { MapView } from "../../components/citizen/MapView";
import { SidePanel } from "../../components/citizen/SidePanel";

export function CitizenDashboard() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>();

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

  const handleClose = () => {
    setSelectedLocation(null);
  };

  const handleViewLocation = () => {
    if (selectedLocation?.coordinates) {
      setMapCenter(selectedLocation.coordinates);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation activeTab="dashboard" onTabChange={() => {}} />
      <div className="flex">
        <AlertPanel onAlertSelect={(coords) => setMapCenter(coords)} />
        <main className="flex-1 relative">
          <MapView 
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation?.name}
            onPanToLocation={mapCenter}
          >
            {selectedLocation && (
              <SidePanel 
                location={selectedLocation}
                onClose={handleClose}
                onViewLocation={handleViewLocation}
              />
            )}
          </MapView>
        </main>
      </div>
    </div>
  );
}

interface MapViewProps {
  onLocationSelect: (location: any) => void;
  selectedLocation?: string;
  onPanToLocation?: [number, number];
  children?: React.ReactNode; // Add this
}