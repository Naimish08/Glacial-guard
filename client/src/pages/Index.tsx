import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { MapView } from "@/components/MapView";
import { AlertPanel } from "@/components/AlertPanel";
import { AlertsSection } from "@/components/AlertsSection";
import { ReportsSection } from "@/components/ReportsSection";
import { CommunitySection } from "@/components/CommunitySection";
import { StatusTicker } from "@/components/StatusTicker";
import { SidePanel } from "@/components/SidePanel";
import { realTimeAlerts } from "@/components/AlertsSection";

const Index = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<number>();
  const [mapCenter, setMapCenter] = useState<[number, number]>();

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    const matchingAlert = realTimeAlerts.find(
      alert => alert.lakeName === location.name
    );
    if (matchingAlert) {
      setSelectedAlertId(matchingAlert.id);
    }
  };

  const handleAlertSelect = (coordinates: [number, number]) => {
    setMapCenter(coordinates);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} className="flex-none" />
      <StatusTicker className="flex-none" />
      
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "map" ? (
          <>
            <AlertPanel 
              onAlertSelect={handleAlertSelect}
              selectedAlertId={selectedAlertId}
              className="w-80 flex-none overflow-y-auto"
            />
            
            <div className="flex-1 relative">
              <MapView 
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation?.name}
                onPanToLocation={mapCenter}
              />
              
              {selectedLocation && (
                <SidePanel 
                  location={selectedLocation} 
                  onClose={() => setSelectedLocation(null)} 
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "alerts" && <AlertsSection />}
            {activeTab === "reports" && <ReportsSection />}
            {activeTab === "community" && <CommunitySection />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;