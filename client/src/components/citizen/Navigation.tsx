import { cn } from "@/lib/utils";
import { LoginDialog } from "../LoginDialog";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "map", label: "Map View", icon: "🗺️" },
  { id: "alerts", label: "Alerts", icon: "⚠️" },
  { id: "reports", label: "Reports", icon: "📊" },
  { id: "community", label: "Community Feedback", icon: "💬" },
];

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🏔️</div>
          <div>
            <h1 className="text-xl font-bold text-primary flex items-center space-x-2">
              <span>GlacialGuard</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">CITIZEN</span>
            </h1>
            <p className="text-xs text-muted-foreground">Himalayan Glacier Monitoring System</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted/50 rounded-xl p-1.5 border border-border/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-[120px] justify-center",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/80 hover:shadow-sm"
              )}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Citizen Status Indicator */}
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></div>
          <span className="text-sm font-medium text-green-700">System Active</span>
        </div>
      </div>
    </nav>
  );
};