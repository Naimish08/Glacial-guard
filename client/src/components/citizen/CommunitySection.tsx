import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, X, MapPin, Camera, User, AlertTriangle } from "lucide-react";
import { 
  submitCommunityReport, 
  submitMissingPersonReport,
  getCommunityReports,
  getMissingPersonReports,
  type CommunityReport,
  type MissingPersonReport 
} from "@/api/apiService";
import { communityStore } from "@/lib/communityStore";

const communityReports = [
  {
    id: 1,
    villager: "Pemba Sherpa",
    village: "Dingboche",
    timestamp: "2 hours ago",
    report: "Noticed unusual cracks near the lake moraine. Water color appears muddy.",
    images: [
      { id: 1, url: "/api/images/moraine-crack-1.png", caption: "Crack near moraine edge" },
      { id: 2, url: "/api/images/moraine-crack-1.png", caption: "Muddy water color" }
    ],
    verified: true,
    upvotes: 12,
    location: [86.925, 27.90],
    category: "moraine-cracks",
    type: "observation"
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
    type: "observation"
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
    type: "observation"
  }
];

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
    urgency: "high"
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
    urgency: "medium"
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
  const [reportType, setReportType] = useState("observation");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [villageName, setVillageName] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Real data state
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [missingReports, setMissingReports] = useState<MissingPersonReport[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Missing person form state
  const [missingPersonForm, setMissingPersonForm] = useState({
    personName: "",
    age: "",
    lastSeen: "",
    description: "",
    contactInfo: "",
    urgency: "medium"
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Image handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    
    if (validFiles.length !== files.length) {
      alert(`Some files were skipped. Only image files under 5MB are allowed.`);
    }
    
    setUploadedImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReport = async () => {
    if (!newReport.trim() || !villageName.trim()) {
      alert("Please fill in all required fields (village name and description)");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', reportType);
      formData.append('category', selectedCategory);
      formData.append('village', villageName);
      formData.append('location', location);
      formData.append('description', newReport);
      formData.append('villager', 'Current User'); // In real app, get from auth context
      
      uploadedImages.forEach((file) => {
        formData.append('images', file);
      });

      console.log('Submitting report with data:', {
        type: reportType,
        category: selectedCategory,
        village: villageName,
        location: location,
        description: newReport,
        imageCount: uploadedImages.length
      });

      // Show a message about images when server is not available
      if (uploadedImages.length > 0) {
        console.log('Images will be processed when server is available');
      }

      const response = await submitCommunityReport(formData);
      
      if (response.success) {
        // Reset form
        setNewReport("");
        setVillageName("");
        setLocation("");
        setUploadedImages([]);
        setImagePreviews([]);
        
        const message = uploadedImages.length > 0 
          ? "Report submitted successfully! (Images will be processed when server is available)"
          : "Report submitted successfully!";
        alert(message);
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(`Failed to submit report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitMissingPerson = async () => {
    if (!missingPersonForm.personName.trim() || !missingPersonForm.lastSeen.trim()) {
      alert("Please fill in all required fields (person name and last seen location)");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(missingPersonForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('reporter', 'Current User'); // In real app, get from auth context
      formData.append('village', villageName || 'Unknown');
      formData.append('location', JSON.stringify([0, 0])); // In real app, get GPS location
      
      uploadedImages.forEach((file) => {
        formData.append('images', file);
      });

      console.log('Submitting missing person report with data:', {
        ...missingPersonForm,
        village: villageName || 'Unknown',
        imageCount: uploadedImages.length
      });

      // Show a message about images when server is not available
      if (uploadedImages.length > 0) {
        console.log('Images will be processed when server is available');
      }

      const response = await submitMissingPersonReport(formData);
      
      if (response.success) {
        // Reset form
        setMissingPersonForm({
          personName: "",
          age: "",
          lastSeen: "",
          description: "",
          contactInfo: "",
          urgency: "medium"
        });
        setUploadedImages([]);
        setImagePreviews([]);
        
        const message = uploadedImages.length > 0 
          ? "Missing person report submitted successfully! (Images will be processed when server is available)"
          : "Missing person report submitted successfully!";
        alert(message);
      } else {
        throw new Error('Failed to submit missing person report');
      }
    } catch (error) {
      console.error('Error submitting missing person report:', error);
      alert(`Failed to submit report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-safe rounded-full animate-pulse-glow"></div>
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

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="reports">Local Observations</TabsTrigger>
          <TabsTrigger value="missing">Missing Persons</TabsTrigger>
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
                  <Label htmlFor="village">Village Name</Label>
                  <Input 
                    id="village"
                    placeholder="Enter your village" 
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Observation Type</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select observation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moraine-cracks">Cracks/Fissures</SelectItem>
                      <SelectItem value="water-level">Water Level Change</SelectItem>
                      <SelectItem value="debris">Debris/Muddy Water</SelectItem>
                      <SelectItem value="seismic-activity">Unusual Sounds</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location Details</Label>
                <Input 
                  id="location"
                  placeholder="Specific location (e.g., Near Imja Lake, Trail to Base Camp)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe what you observed in detail..."
                  value={newReport}
                  onChange={(e) => setNewReport(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              {/* Image Upload Section */}
              <div>
                <Label>Photos (Optional)</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Add Photos</span>
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Max 5MB per image, up to 5 images
                    </span>
                  </div>
                  
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  {uploadedImages.length} image(s) selected
                </div>
                <Button 
                  onClick={handleSubmitReport}
                  disabled={isSubmitting || !newReport.trim() || !villageName.trim()}
                  className="flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Report</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Reports */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Community Reports</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-muted-foreground">Loading reports...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No community reports yet. Be the first to submit one!</p>
              </div>
            ) : (
              reports.map((report) => (
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
                
                {report.images && report.images.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-muted-foreground">📷 {report.images.length} photo(s) attached</span>
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
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="missing" className="space-y-6">
          {/* Submit Missing Person Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>👤</span>
                <span>Report Missing Person</span>
              </CardTitle>
              <CardDescription>
                Help locate missing community members quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personName">Person's Name</Label>
                  <Input 
                    id="personName"
                    placeholder="Full name of missing person"
                    value={missingPersonForm.personName}
                    onChange={(e) => setMissingPersonForm(prev => ({ ...prev, personName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age"
                    placeholder="Age"
                    type="number"
                    value={missingPersonForm.age}
                    onChange={(e) => setMissingPersonForm(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="lastSeen">Last Seen</Label>
                <Input 
                  id="lastSeen"
                  placeholder="Where and when was this person last seen?"
                  value={missingPersonForm.lastSeen}
                  onChange={(e) => setMissingPersonForm(prev => ({ ...prev, lastSeen: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Physical Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe clothing, appearance, any distinctive features..."
                  value={missingPersonForm.description}
                  onChange={(e) => setMissingPersonForm(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input 
                  id="contactInfo"
                  placeholder="Your phone number for updates"
                  value={missingPersonForm.contactInfo}
                  onChange={(e) => setMissingPersonForm(prev => ({ ...prev, contactInfo: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={missingPersonForm.urgency} onValueChange={(value) => setMissingPersonForm(prev => ({ ...prev, urgency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Person may return soon</SelectItem>
                    <SelectItem value="medium">Medium - Missing for several hours</SelectItem>
                    <SelectItem value="high">High - Immediate concern</SelectItem>
                    <SelectItem value="critical">Critical - Emergency situation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <Label>Photos of Missing Person</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Add Photos</span>
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Recent photos are most helpful
                    </span>
                  </div>
                  
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  {uploadedImages.length} photo(s) selected
                </div>
                <Button 
                  onClick={handleSubmitMissingPerson}
                  disabled={isSubmitting || !missingPersonForm.personName.trim() || !missingPersonForm.lastSeen.trim()}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Submit Report</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Missing Person Reports */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Missing Person Reports</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-muted-foreground">Loading reports...</span>
              </div>
            ) : missingReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No missing person reports yet.</p>
              </div>
            ) : (
              missingReports.map((report) => (
              <Card key={report.id} className="p-4 border-l-4 border-l-orange-500">
                <div className="flex items-start justify-between mb-3">
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
                    <Badge 
                      variant={report.status === "found" ? "default" : "destructive"}
                      className="text-xs"
                    >
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
                
                <div className="mb-3 space-y-2">
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
                </div>
                
                {report.images && report.images.length > 0 && (
                  <div className="mb-3">
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
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <button className="hover:text-foreground">📞 Call Contact</button>
                    <button className="hover:text-foreground">📍 View Location</button>
                    <button className="hover:text-foreground">🔄 Share</button>
                  </div>
                  
                  {report.status === "searching" && (
                    <div className="text-xs text-orange-500">
                      ⚠️ Active search in progress
                    </div>
                  )}
                </div>
              </Card>
              ))
            )}
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