import { useState } from "react";
import { Navigation } from "../../components/citizen/Navigation";
import { AlertPanel } from "../../components/citizen/AlertPanel";
import { MapView } from "../../components/citizen/MapView";
import { SidePanel } from "../../components/citizen/SidePanel";
import { useNavigate } from "react-router-dom";
import { AlertsSection, realTimeAlerts } from "../../components/admin/AlertsSection";
import { ReportsSection } from "../../components/ReportsSection";
import { CommunitySection } from "../../components/citizen/CommunitySection";
import { StatusTicker } from "../../components/StatusTicker";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { LogOut, User, Settings, Home } from "lucide-react";

export function CitizenDashboard() {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<number>();
  const [mapCenter, setMapCenter] = useState<[number, number]>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
      navigate('/');
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

  // If user is not authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <StatusTicker className="flex-none" />

      {/* User Profile Dropdown */}
      <div className="fixed top-4 right-4 z-50">
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
  
}

interface MapViewProps {
  onLocationSelect: (location: any) => void;
  selectedLocation?: string;
  onPanToLocation?: [number, number];
  children?: React.ReactNode; // Add this
}