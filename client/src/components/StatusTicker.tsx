import React from "react";

// Mock data for village status
const villageStatus = [
	{ name: "Dingboche", status: "danger", population: 180 },
	{ name: "Thame", status: "watch", population: 520 },
	{ name: "Chukhung", status: "danger", population: 95 },
	{ name: "Lumding", status: "watch", population: 340 },
	{ name: "Hongde", status: "safe", population: 780 },
	{ name: "Hinku", status: "safe", population: 450 },
	{ name: "Khumjung", status: "safe", population: 1200 },
	{ name: "Tengboche", status: "safe", population: 320 },
	{ name: "Gokyo", status: "watch", population: 150 },
	{ name: "Lobuche", status: "safe", population: 85 },
];

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
						{[...villageStatus, ...villageStatus].map((village, index) => (
							<div
								key={`${village.name}-${index}`}
								className="flex items-center space-x-2 mx-6"
							>
								<span className="text-lg">{getStatusIcon(village.status)}</span>
								<span className="text-sm font-medium text-foreground">
									{village.name}
								</span>
								<span
									className={`text-sm font-semibold ${getStatusColor(
										village.status
									)}`}
								>
									{village.status.toUpperCase()}
								</span>
								<span className="text-xs text-muted-foreground">
									({village.population} residents)
								</span>
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