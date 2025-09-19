import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Helper function to determine risk label from score
const riskLabel = (score: number): string => {
    const prob = score / 100;
    if (prob > 0.8) return "🔴 CRITICAL";
    if (prob > 0.6) return "🟠 HIGH";
    if (prob > 0.4) return "🟡 MODERATE";
    return "🟢 LOW";
};

// Helper function to get the color class for the risk badge
const getRiskColor = (score: number): string => {
    if (score >= 70) return "text-danger";
    if (score >= 40) return "text-watch";
    return "text-safe";
};

// Array of feature names for the input labels
const featureNames: string[] = [
    "Elevation (m)", "Temperature (°C)", "Precipitation (mm)",
    "Solar Radiation (W/m²)", "Wind Speed (m/s)", "Relative Humidity (%)",
    "Snow Depth (cm)", "Glacier Velocity (m/year)", "Mass Balance (m w.e.)",
    "ELA (m)", "Surface Area Change (%)",
];

interface PredictionOutput {
    error?: string;
    glacier_name: string;
    risk_score: number;
    top_contributing_features: string[];
}

export const ModelInputForm = () => {
    const [predictionOutput, setPredictionOutput] = useState<PredictionOutput | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handlePredict = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setPredictionOutput(null);

        const formData = new FormData(event.currentTarget);
        const glacier_name = formData.get("glacier_name") as string;

        const features: number[] = [];
        for (let i = 1; i <= 11; i++) {
            const value = parseFloat(formData.get(`feature${i}`) as string);
            if (isNaN(value)) {
                setIsLoading(false);
                setPredictionOutput({ error: "Please fill in all numerical fields." } as PredictionOutput);
                return;
            }
            features.push(value);
        }

        const recent_data = Array(12).fill(features);
        const payload = { glacier_name, data: recent_data };

        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setPredictionOutput({ error: `Server error: ${errorData.error || response.statusText}` } as PredictionOutput);
                return;
            }

            const data = await response.json();
            setPredictionOutput(data);
        } catch (error) {
            console.error(error);
            setPredictionOutput({ error: "Failed to fetch prediction. Make sure the Flask server is running." } as PredictionOutput);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                <span>📡</span>
                <span>On-Demand Risk Prediction</span>
            </h3>
            <p className="text-muted-foreground mb-6">Enter sensor readings to get an immediate AI-powered risk assessment.</p>
            
            <form onSubmit={handlePredict} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featureNames.map((name, index) => (
                        <div key={index} className="flex flex-col space-y-1">
                            <label 
                                htmlFor={`feature-${index + 1}`} 
                                className="text-sm font-medium text-foreground"
                            >
                                {name}
                            </label>
                            <input
                                type="number"
                                step="any"
                                id={`feature-${index + 1}`}
                                name={`feature${index + 1}`}
                                required
                                className="px-3 py-2 border rounded-md text-sm bg-background"
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <label htmlFor="glacier_name" className="text-sm font-medium text-foreground">
                        Glacier Name
                    </label>
                    <input
                        type="text"
                        id="glacier_name"
                        name="glacier_name"
                        required
                        defaultValue="Bara Shigri"
                        className="w-full px-3 py-2 border rounded-md text-sm bg-background mt-1"
                    />
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Getting Prediction...
                        </>
                    ) : (
                        "🔍 Get Prediction"
                    )}
                </Button>
            </form>

            {predictionOutput && (
                <div className="mt-6 p-4 bg-muted rounded-lg shadow-inner">
                    {predictionOutput.error ? (
                        <p className="text-sm text-red-500 flex items-center space-x-2">
                            <span>❌</span>
                            <span>{predictionOutput.error}</span>
                        </p>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold">
                                🧊 Glacier Name: <span className="text-foreground font-normal">{predictionOutput.glacier_name}</span>
                            </p>
                            <p className="text-sm font-semibold">
                                🎯 Risk Score: <span className="text-foreground font-normal">{predictionOutput.risk_score.toFixed(2)}%</span>
                            </p>
                            <Badge
                                className={cn("text-lg font-bold", getRiskColor(predictionOutput.risk_score))}
                            >
                                {riskLabel(predictionOutput.risk_score)}
                            </Badge>
                            <p className="text-sm font-semibold">
                                🧩 Top Contributing Features: <span className="text-muted-foreground font-normal">{predictionOutput.top_contributing_features.join(", ")}</span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};