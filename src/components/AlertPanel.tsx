import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { himalayanRegions } from "./geojson"; // <-- Import glaciers

// Mock alert data
const alerts = [
	{
		id: 1,
		location: "Imja Glacial Lake",
		risk: "danger",
		score: 8.5,
		timestamp: "2 min ago",
		reason: "Rapid ice melt detected",
		shap: "Temperature +3.2°C, Precipitation +15%",
		forecast: "24-48 hours",
		villages: ["Dingboche", "Chukhung"],
		coordinates: [86.925, 27.8397],
	},
	{
		id: 2,
		location: "Lumding Lake",
		risk: "danger",
		score: 7.9,
		timestamp: "15 min ago",
		reason: "Moraine instability",
		shap: "Seismic activity +25%, Ice thickness -8%",
		forecast: "3-5 days",
		villages: ["Lumding", "Thame"],
		coordinates: [87.0715, 27.8319],
	},
	{
		id: 3,
		location: "Chamlang South",
		risk: "watch",
		score: 5.8,
		timestamp: "1 hour ago",
		reason: "Increased water level",
		shap: "Water flow +12%, Surface area +5%",
		forecast: "1-2 weeks",
		villages: ["Hongde", "Hinku"],
		coordinates: [86.9293, 27.8417],
	},
];

// Get all glaciers from geojson
const glaciers = (himalayanRegions as any).features.map((feature: any, idx: number) => ({
	id: `glacier-${idx}`,
	name: feature.properties?.name ?? "Unknown Glacier",
	status: feature.properties?.status ?? "unknown",
	riskScore: feature.properties?.riskScore ?? "-",
	country: feature.properties?.country ?? "Nepal",
	elevation: feature.properties?.elevation ?? "-",
	coordinates: feature.properties?.center ?? [0, 0],
}));

interface AlertPanelProps {
	onAlertSelect: (coordinates: [number, number]) => void;
	selectedAlertId?: number | string;
	className?: string;
}

export const AlertPanel = ({
	onAlertSelect,
	selectedAlertId,
	className,
}: AlertPanelProps) => {
	const handleAlertClick = (coords: [number, number], id: number | string) => {
		if (coords) {
			onAlertSelect(coords);
		}
	};

	const getRiskBadgeVariant = (risk: string) => {
		switch (risk) {
			case "danger":
				return "destructive";
			case "watch":
				return "secondary";
			case "safe":
				return "default";
			default:
				return "outline";
		}
	};

	const getRiskIcon = (risk: string) => {
		switch (risk) {
			case "danger":
				return "🔴";
			case "watch":
				return "🟠";
			case "safe":
				return "🟢";
			default:
				return "⚪";
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
					AI-powered risk predictions
				</p>
			</div>

			<div className="space-y-3">
				{alerts.map((alert) => (
					<Card
						key={alert.id}
						className={cn(
							"p-3 shadow-card hover:shadow-soft transition-shadow cursor-pointer",
							selectedAlertId === alert.id && "ring-2 ring-primary"
						)}
						onClick={() =>
							handleAlertClick(
								[alert.coordinates[0], alert.coordinates[1]] as [number, number],
								alert.id
							)
						}
					>
						{/* Alert Header */}
						<div className="flex items-start justify-between mb-2">
							<div className="flex items-center space-x-2">
								<span className="text-lg">{getRiskIcon(alert.risk)}</span>
								<div>
									<h3 className="text-sm font-semibold text-foreground">
										{alert.location}
									</h3>
									<p className="text-xs text-muted-foreground">
										{alert.timestamp}
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

						{/* Alert Details */}
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
								<div className="text-primary hover:text-primary/80 cursor-pointer">
									📲 Send SMS
								</div>
							</div>

							<div className="pt-1">
								<p className="text-xs text-muted-foreground mb-1">
									🏘️ Affected Villages:
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
						</div>

						{/* Action Buttons */}
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

			{/* All Glaciers Section */}
			<div className="mt-6">
				<h3 className="text-base font-semibold mb-2 flex items-center gap-2">
					🧊 All Glaciers
				</h3>
				<div className="space-y-2">
					{glaciers.map((g) => (
						<Card
							key={g.id}
							className={cn(
								"p-2 flex items-center gap-3 cursor-pointer hover:bg-accent/10 transition",
								selectedAlertId === g.id && "ring-2 ring-primary"
							)}
							onClick={() => handleAlertClick(g.coordinates, g.id)}
						>
							<span className="text-lg">{getRiskIcon(g.status)}</span>
							<div className="flex-1">
								<div className="font-medium">{g.name}</div>
								<div className="text-xs text-muted-foreground">
									{g.country} • {g.elevation}
								</div>
							</div>
							<Badge variant={getRiskBadgeVariant(g.status)} className="text-xs">
								{g.status}
							</Badge>
						</Card>
					))}
				</div>
			</div>

			{/* Alert Summary */}
			<div className="mt-4 p-3 bg-gradient-glacier rounded-lg">
				<div className="text-center">
					<p className="text-sm font-semibold text-card-foreground">
						Today's Summary
					</p>
					<div className="flex justify-center space-x-4 mt-2 text-xs text-card-foreground/80">
						<span>🔴 2 High Risk</span>
						<span>🟠 1 Watch</span>
						<span>🟢 15 Safe</span>
					</div>
				</div>
			</div>
		</div>
	);
};