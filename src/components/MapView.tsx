import { useState } from "react";
import { cn } from "@/lib/utils";

interface MapViewProps {
  onLocationSelect: (location: any) => void;
  activeTab: string;
}

// Mock data for glacier locations
const glacierLocations = [
  { id: 1, name: "Imja Glacial Lake", risk: "danger", x: 65, y: 45, riskScore: 8.5 },
  { id: 2, name: "Tsho Rolpa Lake", risk: "watch", x: 45, y: 35, riskScore: 6.2 },
  { id: 3, name: "Thulagi Lake", risk: "safe", x: 55, y: 55, riskScore: 2.1 },
  { id: 4, name: "Chamlang South", risk: "watch", x: 70, y: 40, riskScore: 5.8 },
  { id: 5, name: "Lumding Lake", risk: "danger", x: 40, y: 60, riskScore: 7.9 },
  { id: 6, name: "Tsho Og Lake", risk: "safe", x: 35, y: 50, riskScore: 1.8 },
];

export const MapView = ({ onLocationSelect, activeTab }: MapViewProps) => {
  const [hoveredLocation, setHoveredLocation] = useState<number | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe": return "bg-safe";
      case "watch": return "bg-watch";
      case "danger": return "bg-danger";
      default: return "bg-muted";
    }
  };

  const getRiskGlow = (risk: string) => {
    switch (risk) {
      case "safe": return "shadow-glow-safe";
      case "watch": return "shadow-glow-watch";
      case "danger": return "shadow-glow-danger";
      default: return "";
    }
  };

  if (activeTab !== "map") {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="text-4xl mb-4">
            {activeTab === "alerts" && "⚠️"}
            {activeTab === "reports" && "📊"}
            {activeTab === "community" && "💬"}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {activeTab === "alerts" && "Alert Management"}
            {activeTab === "reports" && "Reports & Analytics"}
            {activeTab === "community" && "Community Feedback"}
          </h2>
          <p className="text-muted-foreground">
            This section is under development. Coming soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative overflow-hidden bg-gradient-ice">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-glacier opacity-30"></div>
      
      {/* Himalayan Mountain Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary/20 to-transparent"></div>
      
      {/* Map Title */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 shadow-card">
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <span>🛰️</span>
            <span>Himalayan Glacier Risk Map</span>
          </h2>
          <p className="text-sm text-muted-foreground">Real-time satellite monitoring</p>
        </div>
      </div>

      {/* Risk Legend */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-2">Risk Levels</h3>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-safe shadow-glow-safe"></div>
              <span>🟢 Safe</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-watch shadow-glow-watch"></div>
              <span>🟠 Watch</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-danger shadow-glow-danger"></div>
              <span>🔴 High Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Glacier Locations */}
      {glacierLocations.map((location) => (
        <div
          key={location.id}
          className={cn(
            "absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-150",
            getRiskColor(location.risk),
            getRiskGlow(location.risk),
            hoveredLocation === location.id ? "animate-pulse-glow scale-150" : ""
          )}
          style={{
            left: `${location.x}%`,
            top: `${location.y}%`,
          }}
          onMouseEnter={() => setHoveredLocation(location.id)}
          onMouseLeave={() => setHoveredLocation(null)}
          onClick={() => onLocationSelect(location)}
        >
          {/* Ripple effect for high-risk locations */}
          {location.risk === "danger" && (
            <div className="absolute inset-0 rounded-full bg-danger/30 animate-ping"></div>
          )}
        </div>
      ))}

      {/* Location Tooltips */}
      {hoveredLocation && (
        <div
          className="absolute z-20 bg-card/95 backdrop-blur-sm rounded-lg p-2 shadow-card pointer-events-none"
          style={{
            left: `${glacierLocations.find(l => l.id === hoveredLocation)?.x}%`,
            top: `${(glacierLocations.find(l => l.id === hoveredLocation)?.y || 0) - 10}%`,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          <div className="text-sm font-medium text-foreground">
            {glacierLocations.find(l => l.id === hoveredLocation)?.name}
          </div>
          <div className="text-xs text-muted-foreground">
            Risk Score: {glacierLocations.find(l => l.id === hoveredLocation)?.riskScore}/10
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2">
        <button className="bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-card hover:bg-card transition-colors">
          <span className="text-lg">🔍</span>
        </button>
        <button className="bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-card hover:bg-card transition-colors">
          <span className="text-lg">📍</span>
        </button>
        <button className="bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-card hover:bg-card transition-colors">
          <span className="text-lg">📊</span>
        </button>
      </div>
    </div>
  );
};