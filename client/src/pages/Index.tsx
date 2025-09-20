import React, { useState, useEffect } from "react";
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
import { useTranslations } from "@/lib/TranslationContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<number>();
  const [mapCenter, setMapCenter] = useState<[number, number]>();
  const navigate = useNavigate();
  const { user, role, logout, loading } = useAuth();
  const { t } = useTranslations();

  // Handle role-based routing after login
  useEffect(() => {
    if (!loading && user && role) {
      console.log('🚀 Routing user:', user.email, 'with role:', role);
      if (role === 'admin') {
        console.log('➡️ Navigating to admin dashboard');
        navigate('/admin');
      } else if (role === 'citizen') {
        console.log('➡️ Navigating to citizen dashboard');
        navigate('/citizen');
      }
    }
  }, [user, role, loading, navigate]);

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

  // Show loading while determining user role
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="fixed top-16 left-0 right-0 z-[90]">
        <StatusTicker />
      </div>

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
      
      <div className="flex-1 flex overflow-hidden pt-[112px]">
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