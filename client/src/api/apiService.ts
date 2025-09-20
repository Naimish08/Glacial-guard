import axios from 'axios';
import { ApiResponse, ProcessedData } from '@my-app/models'; // <-- Importing from models!
import { communityStore } from '@/lib/communityStore';

// This points to our Express server
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchProcessedData = async (): Promise<ApiResponse<ProcessedData>> => {
  const { data } = await apiClient.get<ApiResponse<ProcessedData>>('/processed-data');
  return data;
};

// Community Reports API
export interface CommunityReport {
  id: number;
  type: string;
  category: string;
  village: string;
  location: string;
  description: string;
  images: Array<{
    id: number;
    filename: string;
    originalName: string;
    url: string;
    caption: string;
  }>;
  villager: string;
  timestamp: string;
  verified: boolean;
  upvotes: number;
  status: string;
  priority: string;
  adminNotes: string;
}

export interface MissingPersonReport {
  id: number;
  personName: string;
  age: number;
  lastSeen: string;
  description: string;
  contactInfo: string;
  urgency: string;
  images: Array<{
    id: number;
    filename: string;
    originalName: string;
    url: string;
    caption: string;
  }>;
  reporter: string;
  village: string;
  timestamp: string;
  status: string;
  location: [number, number];
  adminNotes: string;
  searchStatus: string;
}

export const submitCommunityReport = async (formData: FormData): Promise<{ success: boolean; data: CommunityReport }> => {
  try {
    const { data } = await apiClient.post('/community/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.warn('Server not available, using local store:', error);
    // Create report and store locally when server is not available
    const mockReport: CommunityReport = {
      id: Date.now(),
      type: formData.get('type') as string || 'observation',
      category: formData.get('category') as string || 'other',
      village: formData.get('village') as string || 'Unknown',
      location: formData.get('location') as string || 'Unknown',
      description: formData.get('description') as string || '',
      images: [],
      villager: formData.get('villager') as string || 'Anonymous',
      timestamp: new Date().toISOString(),
      verified: false,
      upvotes: 0,
      status: 'pending',
      priority: 'medium',
      adminNotes: ''
    };
    
    // Store in local community store
    communityStore.addCommunityReport(mockReport);
    
    return {
      success: true,
      data: mockReport
    };
  }
};

export const getCommunityReports = async (filters?: {
  status?: string;
  priority?: string;
  search?: string;
}): Promise<{ success: boolean; data: CommunityReport[]; total: number }> => {
  try {
    const { data } = await apiClient.get('/community/reports', { params: filters });
    return data;
  } catch (error) {
    console.warn('Server not available, using local store:', error);
    // Initialize store with sample data if empty
    communityStore.initializeWithSampleData();
    
    // Get data from local store
    let reports = communityStore.getCommunityReports();
    
    // Apply filters
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        reports = reports.filter(report => report.status === filters.status);
      }
      if (filters.priority && filters.priority !== 'all') {
        reports = reports.filter(report => report.priority === filters.priority);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        reports = reports.filter(report => 
          report.villager.toLowerCase().includes(searchTerm) ||
          report.village.toLowerCase().includes(searchTerm) ||
          report.description.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    return {
      success: true,
      data: reports,
      total: reports.length
    };
  }
};

export const updateReportStatus = async (
  reportId: number,
  status: string,
  adminNotes?: string
): Promise<{ success: boolean; data: CommunityReport }> => {
  try {
    const { data } = await apiClient.put(`/community/reports/${reportId}/status`, {
      status,
      adminNotes,
    });
    return data;
  } catch (error) {
    console.warn('Server not available, using local store:', error);
    // Update in local store when server is not available
    communityStore.updateCommunityReport(reportId, {
      status,
      verified: status === 'verified',
      adminNotes: adminNotes || ''
    });
    
    // Get the updated report
    const reports = communityStore.getCommunityReports();
    const updatedReport = reports.find(report => report.id === reportId);
    
    if (!updatedReport) {
      throw new Error('Report not found');
    }
    
    return {
      success: true,
      data: updatedReport
    };
  }
};

export const submitMissingPersonReport = async (formData: FormData): Promise<{ success: boolean; data: MissingPersonReport }> => {
  try {
    const { data } = await apiClient.post('/community/missing-persons', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.warn('Server not available, using local store:', error);
    // Create report and store locally when server is not available
    const mockReport: MissingPersonReport = {
      id: Date.now(),
      personName: formData.get('personName') as string || 'Unknown',
      age: parseInt(formData.get('age') as string) || 0,
      lastSeen: formData.get('lastSeen') as string || 'Unknown',
      description: formData.get('description') as string || '',
      contactInfo: formData.get('contactInfo') as string || '',
      urgency: formData.get('urgency') as string || 'medium',
      images: [],
      reporter: formData.get('reporter') as string || 'Anonymous',
      village: formData.get('village') as string || 'Unknown',
      timestamp: new Date().toISOString(),
      status: 'searching',
      location: [0, 0],
      adminNotes: '',
      searchStatus: 'active'
    };
    
    // Store in local community store
    communityStore.addMissingPersonReport(mockReport);
    
    return {
      success: true,
      data: mockReport
    };
  }
};

export const getMissingPersonReports = async (filters?: {
  status?: string;
  search?: string;
}): Promise<{ success: boolean; data: MissingPersonReport[]; total: number }> => {
  try {
    const { data } = await apiClient.get('/community/missing-persons', { params: filters });
    return data;
  } catch (error) {
    console.warn('Server not available, using local store:', error);
    // Initialize store with sample data if empty
    communityStore.initializeWithSampleData();
    
    // Get data from local store
    let reports = communityStore.getMissingPersonReports();
    
    // Apply filters
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        reports = reports.filter(report => report.status === filters.status);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        reports = reports.filter(report => 
          report.personName.toLowerCase().includes(searchTerm) ||
          report.reporter.toLowerCase().includes(searchTerm) ||
          report.village.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    return {
      success: true,
      data: reports,
      total: reports.length
    };
  }
};

export const updateMissingPersonStatus = async (
  reportId: number,
  status: string,
  adminNotes?: string
): Promise<{ success: boolean; data: MissingPersonReport }> => {
  try {
    const { data } = await apiClient.put(`/community/missing-persons/${reportId}/status`, {
      status,
      adminNotes,
    });
    return data;
  } catch (error) {
    console.warn('Server not available, using local store:', error);
    // Update in local store when server is not available
    communityStore.updateMissingPersonReport(reportId, {
      status,
      adminNotes: adminNotes || '',
      searchStatus: status === 'found' ? 'resolved' : 'active'
    });
    
    // Get the updated report
    const reports = communityStore.getMissingPersonReports();
    const updatedReport = reports.find(report => report.id === reportId);
    
    if (!updatedReport) {
      throw new Error('Missing person report not found');
    }
    
    return {
      success: true,
      data: updatedReport
    };
  }
};