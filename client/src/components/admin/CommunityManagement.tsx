import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Flag, 
  MapPin, 
  User, 
  AlertTriangle, 
  Search,
  Filter,
  Download,
  MessageSquare,
  Phone
} from "lucide-react";
import { 
  getCommunityReports, 
  updateReportStatus,
  getMissingPersonReports,
  updateMissingPersonStatus,
  type CommunityReport,
  type MissingPersonReport 
} from "@/api/apiService";
import { communityStore } from "@/lib/communityStore";

// Mock data for community reports
const communityReports = [
  {
    id: 1,
    villager: "Pemba Sherpa",
    village: "Dingboche",
    timestamp: "2 hours ago",
    report: "Noticed unusual cracks near the lake moraine. Water color appears muddy.",
    images: [
      { id: 1, url: "/api/images/moraine-crack-1.jpg", caption: "Crack near moraine edge" },
      { id: 2, url: "/api/images/moraine-crack-2.jpg", caption: "Muddy water color" }
    ],
    verified: true,
    upvotes: 12,
    location: [86.925, 27.90],
    category: "moraine-cracks",
    type: "observation",
    status: "verified",
    priority: "high",
    adminNotes: ""
  },
  {
    id: 2,
    villager: "Dolma Tamang",
    village: "Chukhung", 
    timestamp: "5 hours ago",
    report: "Lake water level has risen significantly since yesterday. Some debris floating.",
    images: [
      { id: 3, url: "/api/images/water-level-1.jpg", caption: "Rising water level" }
    ],
    verified: false,
    upvotes: 8,
    location: [86.930, 27.895],
    category: "water-level",
    type: "observation",
    status: "pending",
    priority: "medium",
    adminNotes: ""
  },
  {
    id: 3,
    villager: "Tenzin Norbu",
    village: "Lumding",
    timestamp: "1 day ago",
    report: "Heard unusual rumbling sounds from glacier direction early morning.",
    images: [],
    verified: true,
    upvotes: 15,
    location: [86.612, 28.035],
    category: "seismic-activity",
    type: "observation",
    status: "verified",
    priority: "high",
    adminNotes: "Confirmed by seismic sensors"
  }
];

// Mock data for missing person reports
const missingPersonReports = [
  {
    id: 1,
    reporter: "Ang Phurba",
    village: "Thame",
    timestamp: "3 hours ago",
    personName: "Lhakpa Sherpa",
    age: 45,
    lastSeen: "Near Imja Lake trail",
    description: "Wearing red jacket, carrying trekking poles",
    contactInfo: "+977-98-1234567",
    images: [
      { id: 1, url: "/api/images/missing-person-1.jpg", caption: "Recent photo" }
    ],
    status: "searching",
    location: [86.720, 27.850],
    urgency: "high",
    adminNotes: "Search team dispatched",
    searchStatus: "active"
  },
  {
    id: 2,
    reporter: "Pema Dolma",
    village: "Namche",
    timestamp: "1 day ago",
    personName: "Tashi Norbu",
    age: 32,
    lastSeen: "Village center, heading towards monastery",
    description: "Blue backpack, hiking boots",
    contactInfo: "+977-98-7654321",
    images: [
      { id: 2, url: "/api/images/missing-person-2.jpg", caption: "Family photo" }
    ],
    status: "found",
    location: [86.710, 27.804],
    urgency: "medium",
    adminNotes: "Person found safe at monastery",
    searchStatus: "resolved"
  }
];

const getCategoryIcon = (category: string) => {
  const icons = {
    "moraine-cracks": "🏔️",
    "water-level": "🌊", 
    "seismic-activity": "📡",
    "debris": "🗿",
    "other": "📍"
  };
  return icons[category as keyof typeof icons] || "📍";
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "text-red-500 border-red-500";
    case "high": return "text-orange-500 border-orange-500";
    case "medium": return "text-yellow-500 border-yellow-500";
    case "low": return "text-green-500 border-green-500";
    default: return "text-gray-500 border-gray-500";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "verified": return "bg-green-100 text-green-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "rejected": return "bg-red-100 text-red-800";
    case "searching": return "bg-orange-100 text-orange-800";
    case "found": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const CommunityManagement = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [missingReports, setMissingReports] = useState<MissingPersonReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadData();
    
    // Subscribe to store changes
    const unsubscribe = communityStore.subscribe(() => {
      loadData();
    });
    
    return unsubscribe;
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsResponse, missingResponse] = await Promise.all([
        getCommunityReports(),
        getMissingPersonReports()
      ]);
      
      if (reportsResponse.success) {
        setReports(reportsResponse.data);
      }
      
      if (missingResponse.success) {
        setMissingReports(missingResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReport = async (reportId: number, status: string) => {
    setIsUpdating(true);
    try {
      const response = await updateReportStatus(reportId, status);
      
      if (response.success) {
        // Update local state
        setReports(prev => prev.map(report => 
          report.id === reportId ? response.data : report
        ));
        alert(`Report ${status === "verified" ? "verified" : "rejected"} successfully!`);
      } else {
        throw new Error('Failed to update report status');
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      alert("Failed to update report status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateMissingPersonStatus = async (reportId: number, status: string) => {
    setIsUpdating(true);
    try {
      const response = await updateMissingPersonStatus(reportId, status);
      
      if (response.success) {
        // Update local state
        setMissingReports(prev => prev.map(report => 
          report.id === reportId ? response.data : report
        ));
        alert(`Missing person status updated to ${status}!`);
      } else {
        throw new Error('Failed to update missing person status');
      }
    } catch (error) {
      console.error('Error updating missing person status:', error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveAdminNotes = async (reportId: number) => {
    setIsUpdating(true);
    try {
      // Determine if it's a community report or missing person report
      const isCommunityReport = reports.some(report => report.id === reportId);
      
      if (isCommunityReport) {
        const response = await updateReportStatus(reportId, 'pending', adminNotes);
        if (response.success) {
          setReports(prev => prev.map(report => 
            report.id === reportId ? response.data : report
          ));
        }
      } else {
        const response = await updateMissingPersonStatus(reportId, 'searching', adminNotes);
        if (response.success) {
          setMissingReports(prev => prev.map(report => 
            report.id === reportId ? response.data : report
          ));
        }
      }
      
      alert("Admin notes saved successfully!");
      setAdminNotes("");
    } catch (error) {
      console.error('Error saving admin notes:', error);
      alert("Failed to save notes");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.villager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesPriority = filterPriority === "all" || report.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const filteredMissingReports = missingReports.filter(report => {
    const matchesSearch = report.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading community reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <span>👥</span>
            <span>Community Management</span>
          </h1>
          <p className="text-muted-foreground">Review and moderate community reports and missing person cases</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse-glow"></div>
            <span className="text-sm text-muted-foreground">
              {reports.length + missingReports.length} Total Reports
            </span>
          </div>
          {reports.length === 0 && missingReports.length === 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                communityStore.initializeWithSampleData();
                loadData();
              }}
            >
              Load Sample Data
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search reports, villagers, villages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="searching">Searching</SelectItem>
                  <SelectItem value="found">Found</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="observations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="observations">Observations ({filteredReports.length})</TabsTrigger>
          <TabsTrigger value="missing">Missing Persons ({filteredMissingReports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="observations" className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
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
                    <Badge className={cn("text-xs", getStatusColor(report.status))}>
                      {report.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs", getPriorityColor(report.priority))}>
                      {report.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(report.category)}</span>
                    <Badge variant="outline" className="text-xs">
                      {report.category.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{report.report}</p>
                  
                  {report.images && report.images.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-muted-foreground">📷 {report.images.length} photo(s)</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {report.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={`http://localhost:5000/api${image.url}`}
                              alt={image.caption}
                              className="w-full h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => window.open(`http://localhost:5000/api${image.url}`, '_blank')}
                            />
                            <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {image.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyReport(report.id, "verified")}
                      disabled={isUpdating}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyReport(report.id, "rejected")}
                      disabled={isUpdating}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>👍 {report.upvotes} upvotes</span>
                    <button className="hover:text-foreground">📍 View on Map</button>
                    <button className="hover:text-foreground">📊 Analytics</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="missing" className="space-y-4">
          {filteredMissingReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{report.personName}</div>
                      <div className="text-sm text-muted-foreground">
                        Reported by {report.reporter} • {report.village} • {report.timestamp}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={cn("text-xs", getStatusColor(report.status))}>
                      {report.status === "found" ? "✅ Found" : "🔍 Searching"}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        report.urgency === "critical" ? "border-red-500 text-red-500" :
                        report.urgency === "high" ? "border-orange-500 text-orange-500" :
                        "border-yellow-500 text-yellow-500"
                      )}
                    >
                      {report.urgency.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Age: </span>
                    <span className="text-muted-foreground">{report.age} years</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Last Seen: </span>
                    <span className="text-muted-foreground">{report.lastSeen}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Description: </span>
                    <span className="text-muted-foreground">{report.description}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Contact: </span>
                    <span className="text-muted-foreground">{report.contactInfo}</span>
                  </div>
                  
                  {report.images && report.images.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-muted-foreground">📷 Photos</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {report.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={`http://localhost:5000/api${image.url}`}
                              alt={image.caption}
                              className="w-full h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => window.open(`http://localhost:5000/api${image.url}`, '_blank')}
                            />
                            <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {image.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    {report.status === "searching" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateMissingPersonStatus(report.id, "found")}
                          disabled={isUpdating}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Found
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Update Status
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <button className="hover:text-foreground flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>Call Contact</span>
                    </button>
                    <button className="hover:text-foreground">📍 View Location</button>
                    <button className="hover:text-foreground">📊 Search Progress</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Report Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add notes about this report..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReport(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSaveAdminNotes(selectedReport.id)}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
