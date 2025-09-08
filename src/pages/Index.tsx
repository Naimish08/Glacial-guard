import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { MapView } from "@/components/MapView";
import { AlertPanel } from "@/components/AlertPanel";
import { AlertsSection } from "@/components/AlertsSection";
import { ReportsSection } from "@/components/ReportsSection";
import { CommunitySection } from "@/components/CommunitySection";
import { StatusTicker } from "@/components/StatusTicker";
import { SidePanel } from "@/components/SidePanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-ice font-rounded">
      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {activeTab === "map" ? (
          <>
            {/* Alert Panel - Left Side */}
            <AlertPanel />
            
            {/* Main Map Area */}
            <div className="flex-1 relative">
              <MapView 
                onLocationSelect={setSelectedLocation}
                activeTab={activeTab}
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
          <div className="flex-1 overflow-y-auto">
            {activeTab === "alerts" && <AlertsSection />}
            {activeTab === "reports" && <ReportsSection />}
            {activeTab === "community" && <CommunitySection />}
          </div>
        )}
      </div>
      
      {/* Status Ticker - Bottom */}
      <StatusTicker />
    </div>
  );
};

export default Index;