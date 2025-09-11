import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { MapView } from "@/components/MapView"; // Reverting back to direct import
import { AlertPanel } from "@/components/AlertPanel";
import { AlertsSection } from "@/components/AlertsSection";
import { ReportsSection } from "@/components/ReportsSection";
import { CommunitySection } from "@/components/CommunitySection";
import { StatusTicker } from "@/components/StatusTicker";
import { SidePanel } from "@/components/SidePanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const handleLocationSelect = (location: any) => {
    console.log("Selected location:", location);
    setSelectedLocation(location);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} className="flex-none" />
      
      {/* Status Ticker */}
      <StatusTicker className="flex-none" />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "map" ? (
          <>
            {/* Alert Panel - Left Side */}
            <AlertPanel className="w-80 flex-none overflow-y-auto" />
            
            {/* Main Map Area */}
            <div className="flex-1 relative">
              <MapView 
                onLocationSelect={handleLocationSelect}
              />
              
              {/* Side Panel for Location Details */}
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