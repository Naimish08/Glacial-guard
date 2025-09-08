import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const weeklyRiskData = [
  { lake: "Imja Glacial Lake", currentRisk: 85, weekChange: +15, trend: "increasing" },
  { lake: "Lumding Lake", currentRisk: 79, weekChange: +8, trend: "increasing" },
  { lake: "Chamlang South", currentRisk: 58, weekChange: -3, trend: "stable" },
  { lake: "Tsho Rolpa", currentRisk: 45, weekChange: +12, trend: "increasing" },
  { lake: "Thulagi Lake", currentRisk: 32, weekChange: -5, trend: "decreasing" },
  { lake: "Dig Tsho", currentRisk: 28, weekChange: 0, trend: "stable" },
];

const forecastData = [
  { day: "Today", confidence: 92, riskLevel: 85, weather: "Clear" },
  { day: "Tomorrow", confidence: 89, riskLevel: 87, weather: "Partly Cloudy" },
  { day: "Day 3", confidence: 85, riskLevel: 83, weather: "Rain" },
  { day: "Day 4", confidence: 78, riskLevel: 79, weather: "Heavy Rain" },
  { day: "Day 5", confidence: 72, riskLevel: 74, weather: "Snow" },
  { day: "Day 6", confidence: 68, riskLevel: 69, weather: "Clear" },
  { day: "Day 7", confidence: 65, riskLevel: 65, weather: "Windy" },
];

const impactEstimation = [
  {
    lake: "Imja Glacial Lake",
    population: 2500,
    livestock: 850,
    infrastructure: ["Tengboche Monastery", "Namche Airport", "EBC Trail"],
    estimatedDamage: "$2.3M",
    evacuationTime: "6-8 hours"
  },
  {
    lake: "Lumding Lake", 
    population: 1800,
    livestock: 620,
    infrastructure: ["Thame Village", "Hydropower Plant", "Trade Route"],
    estimatedDamage: "$1.8M",
    evacuationTime: "4-6 hours"
  }
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "increasing": return "📈";
    case "decreasing": return "📉";
    case "stable": return "➡️";
    default: return "⚪";
  }
};

const getRiskColor = (score: number) => {
  if (score >= 70) return "danger";
  if (score >= 40) return "watch";
  return "safe";
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "increasing": return "text-danger";
    case "decreasing": return "text-safe";
    case "stable": return "text-muted-foreground";
    default: return "text-muted-foreground";
  }
};

export const ReportsSection = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("weekly");
  const [exportFormat, setExportFormat] = useState("pdf");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <span>📊</span>
            <span>Risk Analysis & Reports</span>
          </h1>
          <p className="text-muted-foreground">Strategic insights for long-term planning</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            📅 Export Report
          </Button>
          <Button variant="outline" size="sm">
            📧 Schedule Email
          </Button>
        </div>
      </div>

      <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
          <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
          <TabsTrigger value="comparison">Lake Comparison</TabsTrigger>
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-danger/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-danger">2</div>
                <div className="text-sm text-muted-foreground">High Risk Lakes</div>
              </div>
            </Card>
            <Card className="p-4 bg-watch/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-watch">1</div>
                <div className="text-sm text-muted-foreground">Watch Status</div>
              </div>
            </Card>
            <Card className="p-4 bg-safe/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-safe">15</div>
                <div className="text-sm text-muted-foreground">Safe Lakes</div>
              </div>
            </Card>
            <Card className="p-4 bg-primary/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+20%</div>
                <div className="text-sm text-muted-foreground">Avg Risk Increase</div>
              </div>
            </Card>
          </div>

          {/* Weekly Risk Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🗺️</span>
                <span>Weekly Risk Heatmap</span>
              </CardTitle>
              <CardDescription>
                Risk levels and trends for all monitored glacial lakes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyRiskData.map((lake) => (
                  <div key={lake.lake} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        getRiskColor(lake.currentRisk) === "danger" ? "bg-danger" :
                        getRiskColor(lake.currentRisk) === "watch" ? "bg-watch" : "bg-safe"
                      )}></div>
                      <span className="font-medium text-foreground">{lake.lake}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground">{lake.currentRisk}%</div>
                        <div className="text-xs text-muted-foreground">Current Risk</div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <span className={getTrendColor(lake.trend)}>
                          {getTrendIcon(lake.trend)}
                        </span>
                        <span className={cn(
                          "text-sm font-medium",
                          lake.weekChange > 0 ? "text-danger" : lake.weekChange < 0 ? "text-safe" : "text-muted-foreground"
                        )}>
                          {lake.weekChange > 0 ? "+" : ""}{lake.weekChange}%
                        </span>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>💡</span>
                <span>Key Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-danger/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-danger">🔴</span>
                    <span className="font-medium text-foreground">Critical Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    3 lakes in J&K region showed 20% increase in instability this week.
                  </p>
                </div>
                
                <div className="p-3 bg-watch/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-watch">🟠</span>
                    <span className="font-medium text-foreground">Seasonal Pattern</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Winter stability expected, but moraine weakening anticipated in April-May.
                  </p>
                </div>
                
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-primary">📊</span>
                    <span className="font-medium text-foreground">Prediction Accuracy</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI model achieved 94.2% accuracy in this week's risk predictions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔮</span>
                <span>7-Day Predictive Outlook</span>
              </CardTitle>
              <CardDescription>
                AI-powered risk forecasting with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecastData.map((day) => (
                  <div key={day.day} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[60px]">
                        <div className="font-medium text-foreground">{day.day}</div>
                        <div className="text-xs text-muted-foreground">{day.weather}</div>
                      </div>
                      
                      <div className="flex-1 max-w-[200px]">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Risk Level</span>
                          <span className="font-medium text-foreground">{day.riskLevel}%</span>
                        </div>
                        <Progress 
                          value={day.riskLevel} 
                          className={cn(
                            "h-2",
                            day.riskLevel >= 70 ? "text-danger" :
                            day.riskLevel >= 40 ? "text-watch" : "text-safe"
                          )}
                        />
                      </div>
                      
                      <div className="text-center min-w-[80px]">
                        <div className="text-sm font-medium text-foreground">{day.confidence}%</div>
                        <div className="text-xs text-muted-foreground">Confidence</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🌤️</span>
                <span>Weather Impact Factors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-foreground">+3.2°C</div>
                  <div className="text-sm text-muted-foreground">Temperature Rise</div>
                  <div className="text-xs text-danger mt-1">High Impact</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-foreground">15mm</div>
                  <div className="text-sm text-muted-foreground">Expected Rainfall</div>
                  <div className="text-xs text-watch mt-1">Moderate Impact</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-foreground">25 km/h</div>
                  <div className="text-sm text-muted-foreground">Wind Speed</div>
                  <div className="text-xs text-safe mt-1">Low Impact</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚖️</span>
                <span>Lake-by-Lake Risk Comparison</span>
              </CardTitle>
              <CardDescription>
                Prioritize resources based on comparative risk analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyRiskData
                  .sort((a, b) => b.currentRisk - a.currentRisk)
                  .map((lake, index) => (
                    <div key={lake.lake} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                          index < 2 ? "bg-danger" : index < 4 ? "bg-watch" : "bg-safe"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{lake.lake}</div>
                          <div className="text-sm text-muted-foreground">
                            Risk escalation: {lake.trend}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-foreground">{lake.currentRisk}%</div>
                          <div className="text-xs text-muted-foreground">Current Risk</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={cn(
                            "text-sm font-bold",
                            lake.weekChange > 0 ? "text-danger" : lake.weekChange < 0 ? "text-safe" : "text-muted-foreground"
                          )}>
                            {lake.weekChange > 0 ? "+" : ""}{lake.weekChange}%
                          </div>
                          <div className="text-xs text-muted-foreground">Weekly Change</div>
                        </div>
                        
                        <Badge variant={index < 2 ? "destructive" : index < 4 ? "secondary" : "default"}>
                          {index < 2 ? "Priority High" : index < 4 ? "Priority Medium" : "Priority Low"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          {/* Population Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {impactEstimation.map((impact) => (
              <Card key={impact.lake}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🏘️</span>
                    <span>{impact.lake}</span>
                  </CardTitle>
                  <CardDescription>Flood impact estimation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-danger/10 rounded-lg">
                      <div className="text-xl font-bold text-foreground">{impact.population.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">People at Risk</div>
                    </div>
                    <div className="p-3 bg-watch/10 rounded-lg">
                      <div className="text-xl font-bold text-foreground">{impact.livestock}</div>
                      <div className="text-sm text-muted-foreground">Livestock</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Critical Infrastructure</h4>
                    <div className="space-y-1">
                      {impact.infrastructure.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <span className="text-danger">⚠️</span>
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-border">
                    <div>
                      <div className="text-sm text-muted-foreground">Estimated Damage</div>
                      <div className="font-bold text-danger">{impact.estimatedDamage}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Evacuation Time</div>
                      <div className="font-bold text-foreground">{impact.evacuationTime}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📁</span>
                <span>Decision-Ready Outputs</span>
              </CardTitle>
              <CardDescription>
                Export reports for disaster management authorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex-col space-y-1">
                  <span>📄</span>
                  <span className="text-sm">PDF Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-1">
                  <span>📊</span>
                  <span className="text-sm">CSV Data</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-1">
                  <span>🖼️</span>
                  <span className="text-sm">Briefing Slides</span>
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span>📧</span>
                  <span className="font-medium text-foreground">Auto-Generated Brief</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Based on current risk analysis, immediate attention required for Imja and Lumding lakes. 
                  Recommend evacuation drills for Dingboche and Chukhung villages within 48 hours."
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};