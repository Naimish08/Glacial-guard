import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { LogOut, User, Settings, Home } from "lucide-react";
import { Navigation } from "../../components/citizen/Navigation";
import { AlertPanel } from "../../components/citizen/AlertPanel";
import { MapView } from "../../components/citizen/MapView";
import { SidePanel } from "../../components/citizen/SidePanel";
import { AlertsSection, realTimeAlerts } from "../../components/citizen/AlertsSection";
import { ReportsSection } from "../../components/ReportsSection";
import { CommunitySection } from "../../components/citizen/CommunitySection";

// Assuming you have a separate StatusTicker component
// If not, you can create it as shown below
const StatusTicker = () => {
  return (
    <div className="flex items-center justify-center space-x-2 h-10 py-2 bg-background border-b border-border">
      <div className="w-2 h-2 bg-safe rounded-full animate-pulse-glow"></div>
      <span className="text-sm text-muted-foreground">System Active</span>
    </div>
  );
};

export function CitizenDashboard() {
  const { user, logout } = useAuth(); // <-- Add logout here
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<any>("map");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<number>();
  const [mapCenter, setMapCenter] = useState<[number, number]>();
  
  const handleClose = () => {
    setSelectedLocation(null);
  };

  const handleViewLocation = () => {
    if (selectedLocation?.coordinates) {
      setMapCenter(selectedLocation.coordinates);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
      {/* 1. Main Navigation Bar (fixed at top with z-index 100) */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 2. Status Ticker (fixed below nav bar with z-index 90) */}
      <div className="fixed top-16 left-0 right-0 z-[90]">
        <StatusTicker />
      </div>

      {/* 3. User Profile Dropdown */}
      <div className="fixed top-4 right-4 z-[110]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-12 h-12 rounded-full p-0">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback> 
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.user_metadata?.full_name || 'Citizen User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* 4. Main content, with padding to offset the fixed header elements */}
      {/* The combined height of the nav (h-16) and ticker (h-12) is ~64px + 48px = 112px */}
      {/* So, we use a padding top of pt-[112px] */}
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
}

// NOTE: This interface should be moved to a separate types file for better organization.
interface MapViewProps {
  onLocationSelect: (location: any) => void;
  selectedLocation?: string;
  onPanToLocation?: [number, number];
  children?: React.ReactNode; 
}