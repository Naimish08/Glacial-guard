import { CommunityReport, MissingPersonReport } from '@/api/apiService';

// Shared in-memory store for community data
// This will persist data across components when server is not available
class CommunityStore {
  private communityReports: CommunityReport[] = [];
  private missingPersonReports: MissingPersonReport[] = [];
  private listeners: (() => void)[] = [];

  // Add a report
  addCommunityReport(report: CommunityReport) {
    this.communityReports.unshift(report);
    this.notifyListeners();
  }

  // Add a missing person report
  addMissingPersonReport(report: MissingPersonReport) {
    this.missingPersonReports.unshift(report);
    this.notifyListeners();
  }

  // Get all community reports
  getCommunityReports(): CommunityReport[] {
    return [...this.communityReports];
  }

  // Get all missing person reports
  getMissingPersonReports(): MissingPersonReport[] {
    return [...this.missingPersonReports];
  }

  // Update a community report
  updateCommunityReport(id: number, updates: Partial<CommunityReport>) {
    const index = this.communityReports.findIndex(report => report.id === id);
    if (index !== -1) {
      this.communityReports[index] = { ...this.communityReports[index], ...updates };
      this.notifyListeners();
    }
  }

  // Update a missing person report
  updateMissingPersonReport(id: number, updates: Partial<MissingPersonReport>) {
    const index = this.missingPersonReports.findIndex(report => report.id === id);
    if (index !== -1) {
      this.missingPersonReports[index] = { ...this.missingPersonReports[index], ...updates };
      this.notifyListeners();
    }
  }

  // Subscribe to changes
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Initialize with some sample data
  initializeWithSampleData() {
    if (this.communityReports.length === 0) {
      this.communityReports = [
        {
          id: 1,
          type: 'observation',
          category: 'moraine-cracks',
          village: 'Dingboche',
          location: 'Near Imja Lake moraine',
          description: 'Noticed unusual cracks near the lake moraine. Water color appears muddy.',
          images: [
            { id: 1, filename: 'moraine-crack-1.png', originalName: 'moraine-crack-1.png', url: '/api/images/moraine-crack-1.png', caption: 'Crack near moraine edge' },
            { id: 2, filename: 'moraine-crack-2.png', originalName: 'moraine-crack-2.png', url: '/api/images/moraine-crack-1.png', caption: 'Muddy water color' }
          ],
          villager: 'Pemba Sherpa',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          verified: true,
          upvotes: 12,
          status: 'verified',
          priority: 'high',
          adminNotes: 'Confirmed by field inspection'
        },
        {
          id: 2,
          type: 'observation',
          category: 'water-level',
          village: 'Chukhung',
          location: 'Imja Lake shoreline',
          description: 'Lake water level has risen significantly since yesterday. Some debris floating.',
          images: [
            { id: 3, filename: 'water-level-1.png', originalName: 'water-level-1.png', url: '/api/images/water-level-1.png', caption: 'Rising water level' }
          ],
          villager: 'Dolma Tamang',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          verified: false,
          upvotes: 8,
          status: 'pending',
          priority: 'medium',
          adminNotes: ''
        },
        {
          id: 3,
          type: 'observation',
          category: 'seismic-activity',
          village: 'Lumding',
          location: 'Glacier valley',
          description: 'Heard unusual rumbling sounds from glacier direction early morning.',
          images: [],
          villager: 'Tenzin Norbu',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          verified: true,
          upvotes: 15,
          status: 'verified',
          priority: 'high',
          adminNotes: 'Confirmed by seismic sensors'
        }
      ];
    }

    if (this.missingPersonReports.length === 0) {
      this.missingPersonReports = [
        {
          id: 1,
          personName: 'Lhakpa Sherpa',
          age: 45,
          lastSeen: 'Near Imja Lake trail',
          description: 'Wearing red jacket, carrying trekking poles',
          contactInfo: '+977-98-1234567',
          urgency: 'high',
          images: [
            { id: 1, filename: 'missing-person-1.png', originalName: 'missing-person-1.png', url: '/api/images/missing-person-1.png', caption: 'Recent photo' }
          ],
          reporter: 'Ang Phurba',
          village: 'Thame',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          status: 'searching',
          location: [86.720, 27.850],
          adminNotes: 'Search team dispatched',
          searchStatus: 'active'
        },
        {
          id: 2,
          personName: 'Tashi Norbu',
          age: 32,
          lastSeen: 'Village center, heading towards monastery',
          description: 'Blue backpack, hiking boots',
          contactInfo: '+977-98-7654321',
          urgency: 'medium',
          images: [
            { id: 2, filename: 'missing-person-2.png', originalName: 'missing-person-2.png', url: '/api/images/missing-person-2.png', caption: 'Family photo' }
          ],
          reporter: 'Pema Dolma',
          village: 'Namche',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          status: 'found',
          location: [86.710, 27.804],
          adminNotes: 'Person found safe at monastery',
          searchStatus: 'resolved'
        }
      ];
    }

    this.notifyListeners();
  }
}

// Export singleton instance
export const communityStore = new CommunityStore();
