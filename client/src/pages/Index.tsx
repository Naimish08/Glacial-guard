import React, { useState } from "react";
import { Navigation } from "@/components/admin/Navigation";
import { MapView } from "@/components/admin/MapView";
import { AlertPanel } from "@/components/admin/AlertPanel";
import { AlertsSection, realTimeAlerts } from "@/components/admin/AlertsSection";
import { ReportsSection } from "@/components/ReportsSection";
import { CommunitySection } from "@/components/citizen/CommunitySection";
import { StatusTicker } from "@/components/StatusTicker";
import { SidePanel } from "@/components/citizen/SidePanel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<number>();
  const [mapCenter, setMapCenter] = useState<[number, number]>();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <StatusTicker className="flex-none" />

      {/* Authentication buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {user ? (
          <>
            <Button
              onClick={() => navigate(role === 'admin' ? '/admin' : '/citizen')}
              className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
              aria-label="Dashboard"
              title="Go to Dashboard"
            >
              📊
            </Button>
            <Button
              onClick={handleLogout}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
              aria-label="Logout"
              title="Logout"
            >
              🚪
            </Button>
          </>
        ) : (
          <Button
            onClick={() => navigate('/login')}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition"
            aria-label="Login"
            title="Login"
          >
            🔐
          </Button>
        )}
      </div>
      
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
                  onViewLocation={() => {
                    if (selectedLocation?.coordinates) {
                      setMapCenter(selectedLocation.coordinates);
                    }
                  }}
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