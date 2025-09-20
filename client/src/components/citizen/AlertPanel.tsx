import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMap } from "react-leaflet";
import { useAuth } from "../../lib/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "../../lib/TranslationContext";
import { himalayanRegions } from "../geojson";
import type { FeatureCollection } from "geojson";
// Generate alerts from GeoJSON glacier data
const features = (himalayanRegions as FeatureCollection).features;
const alerts = features
	.filter((feature: any) => feature.properties.status === "danger" || feature.properties.status === "watch")
	.map((feature: any, index: number) => ({
		id: index + 1,
		location: feature.properties.name,
		risk: feature.properties.status,
		score: feature.properties.riskScore || (feature.properties.status === "danger" ? 8.5 : 5.8),
		timestamp: feature.properties.lastUpdated ? `${Math.floor(Math.random() * 60)} min ago` : "1 hour ago",
		reason: feature.properties.riskFactors ? feature.properties.riskFactors.join(", ") : "Risk factors detected",
		shap: `Temperature ${feature.properties.temperature}, Elevation ${feature.properties.elevation}`,
		forecast: feature.properties.status === "danger" ? "24-48 hours" : "1-2 weeks",
		villages: ["Nearby villages"],
		coordinates: feature.properties.center || [0, 0],
	}));

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
	const { isAdmin } = useAuth();
	const { t } = useTranslations();

	const handleAlertClick = (alert: any) => {
		// Assuming each alert has coordinates in [longitude, latitude] format
		if (alert.coordinates) {
			onAlertSelect(alert.coordinates);
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
					<span>{t("active_alerts")}</span>
				</h2>
				<p className="text-sm text-muted-foreground">
					{t("ai_powered_risk_predictions")}
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
						onClick={() => handleAlertClick(alert)}
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
									📊 {t("ai_analysis")}
								</p>
								<p className="text-xs text-muted-foreground">
									{alert.reason}
								</p>
							</div>

							<div className="bg-accent/10 rounded-md p-2">
								<p className="text-xs font-medium text-foreground mb-1 flex items-center space-x-1">
									<span>🔬</span>
									<span>{t("shap_explanation")}</span>
								</p>
								<p className="text-xs text-muted-foreground">
									{alert.shap}
								</p>
							</div>

							<div className="flex items-center justify-between text-xs">
								<div>
									<span className="text-muted-foreground">📅 {t("forecast")}: </span>
									<span className="font-medium text-foreground">
										{alert.forecast}
									</span>
								</div>
								<div className="text-muted-foreground">
									📊 {t("view_details")}
								</div>
							</div>

							<div className="pt-1">
								<p className="text-xs text-muted-foreground mb-1">
									🏘️ {t("affected_villages")}:
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
								{t("view_details")}
							</button>
							<button className="flex-1 bg-watch/10 hover:bg-watch/20 text-watch text-xs font-medium py-1.5 rounded-md transition-colors">
								🌊 {t("flood_map")}
							</button>
						</div>
					</Card>
				))}
			</div>

			{/* Alert Summary */}
			<div className="mt-4 p-3 bg-gradient-glacier rounded-lg">
				<div className="text-center">
					<p className="text-sm font-semibold text-card-foreground">
						{t("todays_summary")}
					</p>
					<div className="flex justify-center space-x-4 mt-2 text-xs text-card-foreground/80">
						<span>🔴 2 {t("high_risk")}</span>
						<span>🟠 1 {t("watch")}</span>
						<span>🟢 15 {t("safe")}</span>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				{isAdmin && (
					<Alert variant="default" className="bg-blue-50 border-blue-200">
						<AlertCircle className="h-4 w-4 text-blue-600" />
						<AlertTitle className="text-blue-800">Welcome Admin</AlertTitle>
						<AlertDescription className="text-blue-700">
							You are logged in as an administrator
						</AlertDescription>
					</Alert>
				)}
			</div>
		</div>
	);
};