import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SidePanelProps {
  location: any;
  onClose: () => void;
}

export const SidePanel = ({ location, onClose }: SidePanelProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe": return "text-safe";
      case "watch": return "text-watch";
      case "danger": return "text-danger";
      default: return "text-muted-foreground";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "safe": return "🟢";
      case "watch": return "🟠";
      case "danger": return "🔴";
      default: return "⚪";
    }
  };

  // Mock detailed data
  const details = {
    lakeDetails: {
      area: "0.85 km²",
      volume: "35.2 million m³",
      elevation: "5,010 m",
      temperature: "-2.3°C",
      lastSurvey: "November 2024",
    },
    morainaCondition: {
      stability: location.risk === "danger" ? "Critical" : location.risk === "watch" ? "Monitoring" : "Stable",
      thickness: "25-40 m",
      composition: "Loose debris, ice core",
      lastInspection: "3 days ago",
    },
    floodCorridor: {
      primaryPath: "Imja Khola Valley",
      timeToReach: "45-60 minutes",
      affectedArea: "12.5 km downstream",
      evacuationRoutes: 3,
    },
  };

  const preparednessItems = [
    "🚨 Emergency contact: +977-1-4445321",
    "📍 Evacuation route: Head to higher ground via Ridge Trail",
    "🎒 Keep emergency kit ready (3 days supplies)",
    "📱 Monitor SMS alerts from GlacialGuard",
    "🏃‍♂️ Practice evacuation drill monthly",
    "🤝 Coordinate with village emergency committee",
  ];

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-soft overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getRiskIcon(location.risk)}</span>
          <div>
            <h2 className="text-lg font-bold text-foreground">{location.name}</h2>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${getRiskColor(location.risk)}`}>
                Risk Score: {location.riskScore}/10
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-md transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Lake Details */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
            <span>🏔️</span>
            <span>Lake Details</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Area:</span>
              <div className="font-medium text-foreground">{details.lakeDetails.area}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Volume:</span>
              <div className="font-medium text-foreground">{details.lakeDetails.volume}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Elevation:</span>
              <div className="font-medium text-foreground">{details.lakeDetails.elevation}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Temperature:</span>
              <div className="font-medium text-foreground">{details.lakeDetails.temperature}</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            Last Survey: {details.lakeDetails.lastSurvey}
          </div>
        </Card>

        {/* Moraine Condition */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
            <span>🪨</span>
            <span>Moraine Condition</span>
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Stability:</span>
              <Badge variant={location.risk === "danger" ? "destructive" : location.risk === "watch" ? "secondary" : "default"}>
                {details.morainaCondition.stability}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Thickness:</span>
                <div className="font-medium text-foreground">{details.morainaCondition.thickness}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Composition:</span>
                <div className="font-medium text-foreground">{details.morainaCondition.composition}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Flood Corridor Map */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
            <span>🌊</span>
            <span>Flood Corridor</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="bg-danger/10 rounded-md p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-muted-foreground">Primary Path:</span>
                <span className="font-medium text-foreground">{details.floodCorridor.primaryPath}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time to Reach:</span>
                <span className="font-medium text-danger">{details.floodCorridor.timeToReach}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground">Affected Area:</span>
                <div className="font-medium text-foreground">{details.floodCorridor.affectedArea}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Evacuation Routes:</span>
                <div className="font-medium text-foreground">{details.floodCorridor.evacuationRoutes} available</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Preparedness Tips */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
            <span>🛡️</span>
            <span>Preparedness Tips</span>
            <Badge variant="outline" className="text-xs ml-auto">Local Language</Badge>
          </h3>
          <div className="space-y-2">
            {preparednessItems.map((tip, index) => (
              <div key={index} className="text-xs text-muted-foreground bg-muted/30 rounded-md p-2">
                {tip}
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-border">
            <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium py-2 rounded-md transition-colors">
              📲 Share Community Alert
            </button>
          </div>
        </Card>

        {/* Satellite Data */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
            <span>🛰️</span>
            <span>Satellite Data</span>
          </h3>
          <div className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Image:</span>
              <span className="text-foreground font-medium">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cloud Cover:</span>
              <span className="text-foreground font-medium">15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resolution:</span>
              <span className="text-foreground font-medium">10m/pixel</span>
            </div>
            <button className="w-full mt-2 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium py-1.5 rounded-md transition-colors">
              View Historical Images
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};