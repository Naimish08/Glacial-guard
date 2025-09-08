import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const communityReports = [
  {
    id: 1,
    villager: "Pemba Sherpa",
    village: "Dingboche",
    timestamp: "2 hours ago",
    report: "Noticed unusual cracks near the lake moraine. Water color appears muddy.",
    images: 2,
    verified: true,
    upvotes: 12,
    location: [86.925, 27.90],
    category: "moraine-cracks"
  },
  {
    id: 2,
    villager: "Dolma Tamang",
    village: "Chukhung", 
    timestamp: "5 hours ago",
    report: "Lake water level has risen significantly since yesterday. Some debris floating.",
    images: 1,
    verified: false,
    upvotes: 8,
    location: [86.930, 27.895],
    category: "water-level"
  },
  {
    id: 3,
    villager: "Tenzin Norbu",
    village: "Lumding",
    timestamp: "1 day ago",
    report: "Heard unusual rumbling sounds from glacier direction early morning.",
    images: 0,
    verified: true,
    upvotes: 15,
    location: [86.612, 28.035],
    category: "seismic-activity"
  }
];

const preparednessPolls = [
  {
    question: "Did you receive today's morning alert SMS?",
    responses: { yes: 145, no: 23 },
    totalVotes: 168
  },
  {
    question: "How clear was the evacuation route information?",
    responses: { clear: 98, unclear: 45, "very-unclear": 12 },
    totalVotes: 155
  },
  {
    question: "Do you have emergency supplies ready?",
    responses: { yes: 112, partial: 34, no: 22 },
    totalVotes: 168
  }
];

const traditionalKnowledge = [
  {
    id: 1,
    contributor: "Elder Lhakpa",
    village: "Namche",
    knowledge: "When yaks refuse to graze near lake areas, it often indicates ground instability within 2-3 days.",
    category: "Animal Behavior",
    upvotes: 28,
    verified: true
  },
  {
    id: 2,
    contributor: "Ang Dorje",
    village: "Thame",
    knowledge: "Morning mist that forms unusual patterns over lakes can signal rapid ice melt.",
    category: "Weather Signs",
    upvotes: 22,
    verified: false
  },
  {
    id: 3,
    contributor: "Pema Lama",
    village: "Pangboche",
    knowledge: "Sound of rushing water increasing at night often precedes flood events by 6-12 hours.",
    category: "Audio Signs",
    upvotes: 35,
    verified: true
  }
];

const guardianLeaderboard = [
  { name: "Pemba Sherpa", village: "Dingboche", points: 2450, badges: ["Observer", "Reporter", "Helper"] },
  { name: "Dolma Tamang", village: "Chukhung", points: 1980, badges: ["Observer", "Reporter"] },
  { name: "Tenzin Norbu", village: "Lumding", points: 1750, badges: ["Observer", "Alerter"] },
  { name: "Ang Phurba", village: "Thame", points: 1620, badges: ["Observer"] },
  { name: "Lakpa Sherpa", village: "Namche", points: 1450, badges: ["Reporter"] }
];

const getCategoryIcon = (category: string) => {
  const icons = {
    "moraine-cracks": "🏔️",
    "water-level": "🌊", 
    "seismic-activity": "📡",
    "Animal Behavior": "🐎",
    "Weather Signs": "🌤️",
    "Audio Signs": "🔊"
  };
  return icons[category as keyof typeof icons] || "📍";
};

export const CommunitySection = () => {
  const [newReport, setNewReport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("observation");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <span>👥</span>
            <span>Community Feedback</span>
          </h1>
          <p className="text-muted-foreground">Two-way communication for better predictions</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-safe rounded-full animate-pulse-glow"></div>
          <span className="text-sm text-muted-foreground">168 Active Contributors</span>
        </div>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Local Observations</TabsTrigger>
          <TabsTrigger value="feedback">Preparedness</TabsTrigger>
          <TabsTrigger value="knowledge">Traditional Knowledge</TabsTrigger>
          <TabsTrigger value="guardians">Guardian Program</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Submit New Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📝</span>
                <span>Report Observation</span>
              </CardTitle>
              <CardDescription>
                Help improve AI accuracy by sharing what you observe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Village Name</label>
                  <Input placeholder="Enter your village" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Observation Type</label>
                  <select className="w-full p-2 border border-input rounded-md bg-background text-foreground">
                    <option value="cracks">Cracks/Fissures</option>
                    <option value="water">Water Level Change</option>
                    <option value="debris">Debris/Muddy Water</option>
                    <option value="sounds">Unusual Sounds</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <Textarea 
                  placeholder="Describe what you observed in detail..."
                  value={newReport}
                  onChange={(e) => setNewReport(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    📷 Add Photos
                  </Button>
                  <Button variant="outline" size="sm">
                    📍 Add Location
                  </Button>
                </div>
                <Button>Submit Report</Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Reports */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Community Reports</h3>
            {communityReports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {report.villager.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{report.villager}</div>
                      <div className="text-sm text-muted-foreground">{report.village} • {report.timestamp}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {report.verified && (
                      <Badge variant="default" className="text-xs">
                        ✅ Verified
                      </Badge>
                    )}
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-muted-foreground">{report.upvotes}</span>
                      <Button variant="ghost" size="sm" className="p-1">
                        👍
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(report.category)}</span>
                    <Badge variant="outline" className="text-xs">
                      {report.category.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{report.report}</p>
                </div>
                
                {report.images > 0 && (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm text-muted-foreground">📷 {report.images} photo(s) attached</span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Images
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <button className="hover:text-foreground">🔄 Share</button>
                    <button className="hover:text-foreground">💬 Comment</button>
                    <button className="hover:text-foreground">📍 View on Map</button>
                  </div>
                  
                  {report.verified && (
                    <div className="text-xs text-safe">
                      ✅ Confirms AI prediction
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          {/* Alert Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📱</span>
                <span>Alert System Feedback</span>
              </CardTitle>
              <CardDescription>
                Help us improve alert clarity and delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preparednessPolls.map((poll, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground mb-3">{poll.question}</h4>
                    
                    <div className="space-y-2">
                      {Object.entries(poll.responses).map(([option, count]) => (
                        <div key={option} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="text-sm text-muted-foreground capitalize">
                              {option.replace("-", " ")}
                            </span>
                            <div className="flex-1 max-w-[200px]">
                              <Progress 
                                value={(count / poll.totalVotes) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                          <div className="text-sm font-medium text-foreground ml-4">
                            {count} ({Math.round((count / poll.totalVotes) * 100)}%)
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      Total responses: {poll.totalVotes}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⭐</span>
                <span>Rate Today's Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  How would you rate the clarity of today's morning alert?
                </p>
                
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-2xl hover:scale-110 transition-transform">
                      ⭐
                    </button>
                  ))}
                </div>
                
                <Button variant="outline" size="sm">
                  Submit Rating
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          {/* Traditional Knowledge Hub */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🏛️</span>
                <span>Traditional Knowledge Hub</span>
              </CardTitle>
              <CardDescription>
                Bridging AI predictions with indigenous wisdom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {traditionalKnowledge.map((knowledge) => (
                  <div key={knowledge.id} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getCategoryIcon(knowledge.category)}</span>
                        <div>
                          <div className="font-medium text-foreground">{knowledge.contributor}</div>
                          <div className="text-sm text-muted-foreground">{knowledge.village}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {knowledge.verified && (
                          <Badge variant="default" className="text-xs">
                            ✅ Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {knowledge.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 italic">
                      "{knowledge.knowledge}"
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <span className="text-muted-foreground">{knowledge.upvotes} people found this helpful</span>
                        <Button variant="ghost" size="sm" className="p-1">
                          👍
                        </Button>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-xs">
                        💬 Discuss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  📝 Share Traditional Knowledge
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardians" className="space-y-6">
          {/* Guardian Program Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🏆</span>
                <span>Guardian Points Program</span>
              </CardTitle>
              <CardDescription>
                Earn points for contributing to community safety
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">50</div>
                  <div className="text-sm text-muted-foreground">Points for Reports</div>
                </div>
                <div className="text-center p-4 bg-safe/10 rounded-lg">
                  <div className="text-2xl font-bold text-safe">25</div>
                  <div className="text-sm text-muted-foreground">Points for Sharing</div>
                </div>
                <div className="text-center p-4 bg-watch/10 rounded-lg">
                  <div className="text-2xl font-bold text-watch">100</div>
                  <div className="text-sm text-muted-foreground">Points for Drills</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">75</div>
                  <div className="text-sm text-muted-foreground">Points for Teaching</div>
                </div>
              </div>
              
              {/* Leaderboard */}
              <div>
                <h4 className="font-medium text-foreground mb-4">Community Guardians Leaderboard</h4>
                <div className="space-y-3">
                  {guardianLeaderboard.map((guardian, index) => (
                    <div key={guardian.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                          index === 0 ? "bg-yellow-500" : 
                          index === 1 ? "bg-gray-400" :
                          index === 2 ? "bg-amber-600" : "bg-muted"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{guardian.name}</div>
                          <div className="text-sm text-muted-foreground">{guardian.village}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-bold text-primary">{guardian.points}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                        
                        <div className="flex space-x-1">
                          {guardian.badges.map((badge) => (
                            <Badge key={badge} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reward Redemption */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🎁</span>
                <span>Reward Store</span>
              </CardTitle>
              <CardDescription>
                Redeem your Guardian Points for useful items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg text-center">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-medium text-foreground">Emergency Kit</div>
                  <div className="text-sm text-muted-foreground mb-2">1500 points</div>
                  <Button variant="outline" size="sm" disabled>
                    Not enough points
                  </Button>
                </div>
                
                <div className="p-4 border border-border rounded-lg text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-medium text-foreground">Mobile Recharge</div>
                  <div className="text-sm text-muted-foreground mb-2">500 points</div>
                  <Button variant="outline" size="sm">
                    Redeem
                  </Button>
                </div>
                
                <div className="p-4 border border-border rounded-lg text-center">
                  <div className="text-2xl mb-2">🏥</div>
                  <div className="font-medium text-foreground">First Aid Training</div>
                  <div className="text-sm text-muted-foreground mb-2">800 points</div>
                  <Button variant="outline" size="sm">
                    Redeem
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};