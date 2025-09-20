import React from "react";
import { himalayanRegions } from "./geojson";

// Extract glacier data from GeoJSON
const glacierStatus = (himalayanRegions as any).features.map((feature: any) => ({
	name: feature.properties.name,
	status: feature.properties.status,
	country: feature.properties.country,
	elevation: feature.properties.elevation,
	riskScore: feature.properties.riskScore || 0,
	lastUpdated: feature.properties.lastUpdated,
}));

interface StatusTickerProps {
	className?: string;
}

export const StatusTicker: React.FC<StatusTickerProps> = ({ className }) => {
	const getStatusIcon = (status: string) => {
		switch (status) {
			case "safe":
				return "🟢";
			case "watch":
				return "🟠";
			case "danger":
				return "🔴";
			default:
				return "⚪";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "safe":
				return "text-safe";
			case "watch":
				return "text-watch";
			case "danger":
				return "text-danger";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<div className="h-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-border overflow-hidden shadow-sm">
			<div className="flex items-center h-full">
				{/* Ticker Label */}
				<div className="flex-shrink-0 bg-primary text-primary-foreground px-4 h-full flex items-center shadow-sm">
					<span className="text-sm font-medium flex items-center space-x-2">
						<span>🌊</span>
						<span>Live Status</span>
					</span>
				</div>

				{/* Scrolling Content */}
				<div className="flex-1 relative overflow-hidden">
					<div className="flex items-center h-full animate-scroll whitespace-nowrap">
						{/* Duplicate the content for seamless scrolling */}
						{[...glacierStatus, ...glacierStatus].map((glacier, index) => (
							<div
								key={`${glacier.name}-${index}`}
								className="flex items-center space-x-2 mx-6"
							>
								<span className="text-lg">{getStatusIcon(glacier.status)}</span>
								<span className="text-sm font-medium text-foreground">
									{glacier.name}
								</span>
								<span
									className={`text-sm font-semibold ${getStatusColor(
										glacier.status
									)}`}
								>
									{glacier.status.toUpperCase()}
								</span>
								<span className="text-xs text-muted-foreground">
									{glacier.country} • {glacier.elevation}
								</span>
								{glacier.riskScore > 0 && (
									<span className="text-xs text-muted-foreground">
										• Risk: {glacier.riskScore}/10
									</span>
								)}
								<span className="text-muted-foreground">•</span>
							</div>
						))}
					</div>
				</div>

				{/* Last Update */}
				<div className="flex-shrink-0 bg-white/80 border-l border-border px-4 h-full flex items-center shadow-sm">
					<span className="text-xs text-muted-foreground font-medium">
						Last updated: {new Date().toLocaleTimeString()}
					</span>
				</div>
			</div>
		</div>
	);
};
