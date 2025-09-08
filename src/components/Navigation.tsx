import { cn } from "@/lib/utils";

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
    <nav className="h-16 bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🏔️</div>
          <div>
            <h1 className="text-xl font-bold text-primary">GlacialGuard</h1>
            <p className="text-xs text-muted-foreground">Himalayan Glacier Monitoring</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              )}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-safe rounded-full animate-pulse-glow"></div>
          <span className="text-sm text-muted-foreground">System Active</span>
        </div>
      </div>
    </nav>
  );
};