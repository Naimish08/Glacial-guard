import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ModelInputForm } from "./ModelInputForm"; // Import the new component

// Re-using existing functions for consistency
const getIndicatorIcon = (indicator) => {
    const icons = {
        "rising-water": "🌊",
        "moraine-cracks": "🏔️",
        "temperature-spike": "🌡️",
        "seismic-activity": "📡",
        "ice-thinning": "❄️",
        "water-flow": "💧",
        "surface-expansion": "📏",
    };
    return icons[indicator] || "⚪";
};

const getRiskColor = (score) => {
    if (score >= 70) return "danger";
    if (score >= 40) return "watch";
    return "safe";
};

const getRiskBadgeVariant = (score) => {
    if (score >= 70) return "destructive";
    if (score >= 40) return "secondary";
    return "default";
};

// Mock data for the real-time alerts tab
export const realTimeAlerts = [
    {
        id: 1,
        lakeId: "IML-001",
        lakeName: "Imja Glacial Lake",
        riskScore: 85,
        timeToRisk: "18 hrs",
        explanation: "Lake water rose 3m in 24 hrs + moraine instability detected",
        indicators: ["rising-water", "moraine-cracks", "temperature-spike"],
        actions: ["Move livestock to higher ground", "Prepare evacuation bag", "Wait for relief team updates"],
        status: { villagers: true, officers: true, controlRoom: false },
        villages: ["Dingboche", "Chukhung"],
        coordinates: [86.925, 27.9],
    },
    {
        id: 2,
        lakeId: "LMD-005",
        lakeName: "Lumding Lake",
        riskScore: 79,
        timeToRisk: "3-5 days",
        explanation: "Seismic activity increased by 25% + ice thickness reduced by 8%",
        indicators: ["seismic-activity", "ice-thinning"],
        actions: ["Monitor water sources", "Check evacuation routes", "Contact emergency services"],
        status: { villagers: true, officers: true, controlRoom: true },
        villages: ["Lumding", "Thame"],
        coordinates: [86.612, 28.035],
    },
    {
        id: 3,
        lakeId: "CML-012",
        lakeName: "Chamlang South",
        riskScore: 58,
        timeToRisk: "1-2 weeks",
        explanation: "Water flow increased by 12% + surface area expanded by 5%",
        indicators: ["water-flow", "surface-expansion"],
        actions: ["Continue normal activities", "Stay informed", "Report any changes"],
        status: { villagers: true, officers: false, controlRoom: false },
        villages: ["Hongde", "Hinku"],
        coordinates: [86.963, 27.772],
    },
];

export const AlertsSection = () => {
    const [selectedView, setSelectedView] = useState("realtime");

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                        <span>📲</span>
                        <span>Alert System</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Life-saving real-time glacier monitoring
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-safe rounded-full animate-pulse-glow"></div>
                    <span className="text-sm text-muted-foreground">
                        System Operational
                    </span>
                </div>
            </div>

            <Tabs
                value={selectedView}
                onValueChange={setSelectedView}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="realtime">Real-Time Feed</TabsTrigger>
                    <TabsTrigger value="satellite">Satellite Data</TabsTrigger>
                    <TabsTrigger value="sensors">IoT Sensors</TabsTrigger>
                    <TabsTrigger value="distribution">Alert Status</TabsTrigger>
                </TabsList>

                <TabsContent value="realtime" className="space-y-4">
                    <div className="grid gap-4">
                        {realTimeAlerts.map((alert) => (
                            <Card
                                key={alert.id}
                                className="p-4 shadow-card hover:shadow-soft transition-shadow"
                            >
                                {/* ... (The existing code for real-time alerts) */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-full",
                                                getRiskColor(alert.riskScore) === "danger"
                                                    ? "bg-danger"
                                                    : getRiskColor(alert.riskScore) === "watch"
                                                        ? "bg-watch"
                                                        : "bg-safe"
                                            )}
                                        ></div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">
                                                {alert.lakeName}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                ID: {alert.lakeId}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant={getRiskBadgeVariant(alert.riskScore)}
                                            className="mb-1"
                                        >
                                            {alert.riskScore}/100
                                        </Badge>
                                        <p className="text-sm font-medium text-foreground">
                                            Peak in {alert.timeToRisk}
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">Risk Level</span>
                                        <span className="font-medium text-foreground">
                                            {alert.riskScore}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={alert.riskScore}
                                        className={cn(
                                            "h-2",
                                            getRiskColor(alert.riskScore) === "danger"
                                                ? "text-danger"
                                                : getRiskColor(alert.riskScore) === "watch"
                                                    ? "text-watch"
                                                    : "text-safe"
                                        )}
                                    />
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span>🔬</span>
                                        <span className="text-sm font-medium text-foreground">
                                            AI Analysis
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {alert.explanation}
                                    </p>
                                    <div className="flex space-x-2 mt-2">
                                        {alert.indicators.map((indicator) => (
                                            <span
                                                key={indicator}
                                                className="text-lg"
                                                title={indicator}
                                            >
                                                {getIndicatorIcon(indicator)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-accent/10 rounded-lg p-3 mb-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span>⚡</span>
                                        <span className="text-sm font-medium text-foreground">
                                            Immediate Actions
                                        </span>
                                    </div>
                                    <ul className="space-y-1">
                                        {alert.actions.map((action, index) => (
                                            <li
                                                key={index}
                                                className="text-sm text-muted-foreground flex items-start space-x-2"
                                            >
                                                <span className="text-accent">•</span>
                                                <span>{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1">
                                            <span
                                                className={
                                                    alert.status.villagers
                                                        ? "text-safe"
                                                        : "text-danger"
                                                }
                                            >
                                                {alert.status.villagers ? "✅" : "❌"}
                                            </span>
                                            <span className="text-muted-foreground">
                                                Villagers
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <span
                                                className={
                                                    alert.status.officers
                                                        ? "text-safe"
                                                        : "text-danger"
                                                }
                                            >
                                                {alert.status.officers ? "✅" : "❌"}
                                            </span>
                                            <span className="text-muted-foreground">
                                                Officers
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <span
                                                className={
                                                    alert.status.controlRoom
                                                        ? "text-safe"
                                                        : "text-danger"
                                                }
                                            >
                                                {alert.status.controlRoom ? "✅" : "❌"}
                                            </span>
                                            <span className="text-muted-foreground">
                                                Control Room
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm">
                                            📊 Details
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            🌊 Flood Map
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            📱 Re-send SMS
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        🏘️ Affected Villages:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {alert.villages.map((village) => (
                                            <Badge
                                                key={village}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {village}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="satellite" className="space-y-4">
                    {/* ... (existing satellite data cards) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-3 flex items-center space-x-2">
                                <span>🛰️</span>
                                <span>Satellite Imagery</span>
                            </h3>
                            <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                                <p className="text-muted-foreground">
                                    Satellite view loading...
                                </p>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Last updated: 2 hrs ago
                                </span>
                                <Button variant="outline" size="sm">
                                    View Full Resolution
                                </Button>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <h3 className="font-semibold mb-3 flex items-center space-x-2">
                                <span>📈</span>
                                <span>Timeline Comparison</span>
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Today vs Last Week
                                    </span>
                                    <Badge variant="destructive">
                                        +15% water level
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Moraine stability
                                    </span>
                                    <Badge variant="secondary">-8% thickness</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Surface temperature
                                    </span>
                                    <Badge variant="destructive">+3.2°C</Badge>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* IoT Sensors Content (UPDATED) */}
                <TabsContent value="sensors" className="space-y-4">
                    {/* The new ModelInputForm component is rendered here */}
                    <ModelInputForm />
                </TabsContent>

                <TabsContent value="distribution" className="space-y-4">
                    {/* ... (existing alert distribution content) */}
                    <div className="grid gap-4">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-4 flex items-center space-x-2">
                                <span>📱</span>
                                <span>Alert Distribution Dashboard</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-safe/10 rounded-lg">
                                    <div className="text-2xl font-bold text-safe">156</div>
                                    <div className="text-sm text-muted-foreground">SMS Sent</div>
                                </div>
                                <div className="text-center p-4 bg-watch/10 rounded-lg">
                                    <div className="text-2xl font-bold text-watch">12</div>
                                    <div className="text-sm text-muted-foreground">Failed Delivery</div>
                                </div>
                                <div className="text-center p-4 bg-primary/10 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">89%</div>
                                    <div className="text-sm text-muted-foreground">Success Rate</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-medium text-foreground">
                                    Distribution Timeline
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                        <span className="text-sm">Villagers (LoRa/SMS)</span>
                                        <span className="text-safe">✅ Delivered - 2 min ago</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                        <span className="text-sm">District Officers</span>
                                        <span className="text-safe">✅ Acknowledged - 5 min ago</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                        <span className="text-sm">State Control Room</span>
                                        <span className="text-watch">⏳ Pending response</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                        <span className="text-sm">Emergency Services</span>
                                        <span className="text-safe">✅ Units dispatched - 8 min ago</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};