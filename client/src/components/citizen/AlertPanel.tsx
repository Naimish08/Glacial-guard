import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "../../lib/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { AlertCircle, MessageSquare } from "lucide-react";

// Updated glacier data with real locations from your table
const glacierAlerts = [
    {
        id: 1,
        location: "Bara Shigri",
        region: "Himachal Pradesh",
        risk: "danger",
        score: 8.5,
        timestamp: "2 min ago",
        reason: "Rapid ice melt detected",
        shap: "Temperature +3.2°C, Precipitation +15%",
        forecast: "24-48 hours",
        villages: ["Keylong", "Manali", "Lahaul Valley"],
        coordinates: [77.58, 32.2],
        phoneNumbers: ["+919876543210", "+919876543211", "+919876543212"],
        localLanguages: ["hindi", "english"],
        evacuationZones: ["Keylong", "Manali"]
    },
    {
        id: 2,
        location: "Gangotri",
        region: "Uttarakhand", 
        risk: "danger",
        score: 7.9,
        timestamp: "15 min ago",
        reason: "Moraine instability",
        shap: "Seismic activity +25%, Ice thickness -8%",
        forecast: "3-5 days",
        villages: ["Gangotri", "Uttarkashi", "Harsil"],
        coordinates: [79.08, 30.99],
        phoneNumbers: ["+919876543221", "+919876543222", "+919876543223"],
        localLanguages: ["hindi", "garhwali", "kumaoni", "english"],
        evacuationZones: ["Gangotri", "Uttarkashi"]
    },
    {
        id: 3,
        location: "Siachen",
        region: "Kashmir",
        risk: "watch",
        score: 5.8,
        timestamp: "1 hour ago",
        reason: "Increased water level",
        shap: "Water flow +12%, Surface area +5%",
        forecast: "1-2 weeks",
        villages: ["Nubra Valley", "Diskit"],
        coordinates: [77.1, 35.28],
        phoneNumbers: ["+919876543224", "+919876543225", "+919876543226"],
        localLanguages: ["urdu", "hindi", "english"],
        evacuationZones: ["Nubra Valley", "Diskit"]
    },
    {
        id: 4,
        location: "Khumbu",
        region: "Nepal",
        risk: "danger",
        score: 8.2,
        timestamp: "5 min ago",
        reason: "Ice dam formation",
        shap: "Ice thickness +15%, Temperature fluctuation +40%",
        forecast: "12-24 hours",
        villages: ["Namche Bazaar", "Lukla", "Everest Base Camp"],
        coordinates: [86.85, 27.98],
        phoneNumbers: ["+977984123456", "+977984123457"],
        localLanguages: ["nepali", "english"],
        evacuationZones: ["Namche Bazaar", "Lukla"]
    },
    {
        id: 5,
        location: "Yamunotri",
        region: "Uttarakhand",
        risk: "watch",
        score: 6.1,
        timestamp: "30 min ago",
        reason: "Accelerated melting",
        shap: "Snow cover -12%, Surface temperature +2.5°C",
        forecast: "4-7 days",
        villages: ["Yamunotri", "Hanuman Chatti", "Har Ki Dun"],
        coordinates: [78.45, 31.01],
        phoneNumbers: ["+919876543230", "+919876543231", "+919876543232"],
        localLanguages: ["hindi", "garhwali", "kumaoni", "english"],
        evacuationZones: ["Yamunotri", "Hanuman Chatti"]
    }
];

interface AlertPanelProps {
    onAlertSelect: (coordinates: [number, number]) => void;
    selectedAlertId?: number;
    className?: string;
}

export const AlertPanel = ({
    onAlertSelect,
    selectedAlertId,
    className,
}: AlertPanelProps) => {
    const { role, user } = useAuth(); // Use role instead of isAdmin
    const [sendingAlerts, setSendingAlerts] = useState<Set<number>>(new Set());

    const handleAlertClick = (alert: any) => {
        if (alert.coordinates) {
            onAlertSelect(alert.coordinates);
        }
    };

    const sendEmergencyAlert = async (alert: any) => {
        setSendingAlerts(prev => new Set(prev).add(alert.id));
        
        try {
            // For multilingual alerts, use the new endpoint
            const alertData = {
                glacierName: alert.location,
                riskScore: alert.score,
                floodTimeMinutes: 45,
                evacuationTimeMinutes: 30
            };

            // Send multilingual emergency alert
            const response = await fetch('http://localhost:3000/api/alerts/multilingual-emergency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alertData)
            });

            const result = await response.json();
            
            if (result.status === 'multilingual_emergency_alert_dispatched') {
                console.log(`Multilingual emergency alert sent for ${alert.location}:`, result);
                alert(`✅ Emergency alert sent in ${result.languagesUsed.length} languages to ${result.results.summary.totalSent} contacts for ${alert.location}`);
            } else {
                throw new Error('Failed to send alert');
            }
        } catch (error) {
            console.error('Error sending emergency alert:', error);
            alert(`❌ Failed to send emergency alert for ${alert.location}`);
        } finally {
            setSendingAlerts(prev => {
                const newSet = new Set(prev);
                newSet.delete(alert.id);
                return newSet;
            });
        }
    };

    const getRiskBadgeVariant = (risk: string) => {
        switch (risk) {
            case "danger": return "destructive";
            case "watch": return "secondary";
            case "safe": return "default";
            default: return "outline";
        }
    };

    const getRiskIcon = (risk: string) => {
        switch (risk) {
            case "danger": return "🔴";
            case "watch": return "🟠";
            case "safe": return "🟢";
            default: return "⚪";
        }
    };

    return (
        <div className={cn("bg-card border-r border-border p-4", className)}>
            <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>Active Alerts</span>
                </h2>
                <p className="text-sm text-muted-foreground">
                    AI-powered risk predictions with multilingual support
                </p>
            </div>

            <div className="space-y-3">
                {glacierAlerts.map((alert) => (
                    <Card
                        key={alert.id}
                        className={cn(
                            "p-3 shadow-card hover:shadow-soft transition-shadow cursor-pointer",
                            selectedAlertId === alert.id && "ring-2 ring-primary"
                        )}
                        onClick={() => handleAlertClick(alert)}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">{getRiskIcon(alert.risk)}</span>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        {alert.location}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {alert.region} • {alert.timestamp}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant={getRiskBadgeVariant(alert.risk)}
                                className="text-xs"
                            >
                                {alert.score}/10
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="bg-muted/50 rounded-md p-2">
                                <p className="text-xs font-medium text-foreground mb-1">
                                    📊 AI Analysis
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {alert.reason}
                                </p>
                            </div>

                            <div className="bg-accent/10 rounded-md p-2">
                                <p className="text-xs font-medium text-foreground mb-1 flex items-center space-x-1">
                                    <span>🔬</span>
                                    <span>SHAP Explanation</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {alert.shap}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <div>
                                    <span className="text-muted-foreground">📅 Forecast: </span>
                                    <span className="font-medium text-foreground">
                                        {alert.forecast}
                                    </span>
                                </div>
                                
                                {/* Show SMS button only for admin users */}
                                {role === 'admin' && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            sendEmergencyAlert(alert);
                                        }}
                                        disabled={sendingAlerts.has(alert.id)}
                                        className="flex items-center space-x-1 text-xs h-6 px-2"
                                    >
                                        {sendingAlerts.has(alert.id) ? (
                                            <>
                                                <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <MessageSquare className="h-3 w-3" />
                                                <span>Send SMS</span>
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            <div className="pt-1">
                                <p className="text-xs text-muted-foreground mb-1">
                                    🏘️ Affected Areas:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {alert.villages.map((village) => (
                                        <Badge
                                            key={village}
                                            variant="outline"
                                            className="text-xs px-2 py-0.5"
                                        >
                                            {village}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-1">
                                <p className="text-xs text-muted-foreground mb-1">
                                    🌐 Languages: {alert.localLanguages.join(', ')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    📞 Contacts: {alert.phoneNumbers.length} numbers
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-2 mt-3 pt-2 border-t border-border">
                            <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium py-1.5 rounded-md transition-colors">
                                View Details
                            </button>
                            <button className="flex-1 bg-watch/10 hover:bg-watch/20 text-watch text-xs font-medium py-1.5 rounded-md transition-colors">
                                🌊 Flood Map
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Alert Summary */}
            <div className="mt-4 p-3 bg-gradient-glacier rounded-lg">
                <div className="text-center">
                    <p className="text-sm font-semibold text-card-foreground">
                        Today's Summary
                    </p>
                    <div className="flex justify-center space-x-4 mt-2 text-xs text-card-foreground/80">
                        <span>🔴 3 High Risk</span>
                        <span>🟠 2 Watch</span>
                        <span>🟢 5 Safe</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {role === 'admin' && (
                    <Alert variant="default" className="bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">Administrator Access</AlertTitle>
                        <AlertDescription className="text-blue-700">
                            You have admin privileges with multilingual SMS alert capabilities for all {glacierAlerts.length} glacier locations
                        </AlertDescription>
                    </Alert>
                )}
                
                {role === 'citizen' && (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                        <AlertCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Citizen Dashboard</AlertTitle>
                        <AlertDescription className="text-green-700">
                            View-only access to glacial risk alerts and evacuation information
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};
