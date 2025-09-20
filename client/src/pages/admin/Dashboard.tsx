import { AlertPanel } from "../../components/admin/AlertPanel";
import { MapView } from "../../components/admin/MapView";
import { SidePanel } from "../../components/admin/SidePanel";
import { Navigation } from "../../components/admin/Navigation";
import { AlertsSection } from "../../components/admin/AlertsSection";
import { useAuth } from "../../lib/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { LogOut, User, Settings, Home, Shield } from "lucide-react";
import { StatusTicker } from "@/components/StatusTicker";

// Assuming you have a separate StatusTicker component
// If not, you can define it here for this component to use


export function AdminDashboard() {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (role !== 'admin') {
        navigate("/citizen");
      }
    }
  }, [user, role, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading || !user || role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Main Navigation Bar (fixed at top) */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 2. Status Ticker (fixed below the nav bar) */}
      {/* The `top-16` class assumes the navigation bar has a height of h-16 (64px) */}
      <div className="fixed top-16 left-0 right-0 z-[90]">
        <StatusTicker />
      </div>

      {/* 3. Admin User Profile Dropdown */}
      <div className="fixed top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-12 h-12 rounded-full p-0 border-red-200">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-red-100 text-red-700">
                  <Shield className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1">
                  <Shield className="w-3 h-3 text-red-600" />
                  {user?.user_metadata?.full_name || 'Admin User'}
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

      {/* 4. Main content, correctly pushed down by both fixed elements */}
      {/* The combined height of the nav (h-16) and ticker (h-12) is ~64px + 48px = 112px */}
      {/* So, we use a padding top of pt-[112px] */}
      <div className="flex flex-1 pt-[112px]">
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <AlertPanel onAlertSelect={() => {}} />
              <MapView onLocationSelect={() => {}} />
            </div>
          )}
          {activeTab === "alerts" && <AlertsSection />}
        </main>
      </div>
    </div>
  );
}