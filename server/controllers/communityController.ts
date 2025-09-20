import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Mock database - in production, this would be a real database
let communityReports: any[] = [];
let missingPersonReports: any[] = [];

// Community Reports
export const submitCommunityReport = async (req: Request, res: Response) => {
  try {
    console.log('Received community report submission:', req.body);
    console.log('Files received:', req.files);
    
    const { type, category, village, location, description, villager } = req.body;
    const images = req.files as Express.Multer.File[];

    const report = {
      id: Date.now(),
      type: type || 'observation',
      category: category || 'other',
      village: village || 'Unknown',
      location: location || 'Unknown',
      description: description || '',
      images: images ? images.map(img => ({
        id: Date.now() + Math.random(),
        filename: img.filename,
        originalName: img.originalname,
        url: `/uploads/${img.filename}`,
        caption: img.originalname
      })) : [],
      villager: villager || 'Anonymous',
      timestamp: new Date().toISOString(),
      verified: false,
      upvotes: 0,
      status: 'pending',
      priority: 'medium',
      adminNotes: ''
    };

    communityReports.unshift(report);
    console.log('Report created:', report);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report
    });
  } catch (error) {
    console.error('Error submitting community report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCommunityReports = async (req: Request, res: Response) => {
  try {
    const { status, priority, search } = req.query;
    
    let filteredReports = [...communityReports];
    
    if (status && status !== 'all') {
      filteredReports = filteredReports.filter(report => report.status === status);
    }
    
    if (priority && priority !== 'all') {
      filteredReports = filteredReports.filter(report => report.priority === priority);
    }
    
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredReports = filteredReports.filter(report => 
        report.villager.toLowerCase().includes(searchTerm) ||
        report.village.toLowerCase().includes(searchTerm) ||
        report.description.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      success: true,
      data: filteredReports,
      total: filteredReports.length
    });
  } catch (error) {
    console.error('Error fetching community reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const reportIndex = communityReports.findIndex(report => report.id === parseInt(id));
    
    if (reportIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    communityReports[reportIndex].status = status;
    communityReports[reportIndex].verified = status === 'verified';
    if (adminNotes) {
      communityReports[reportIndex].adminNotes = adminNotes;
    }

    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: communityReports[reportIndex]
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Missing Person Reports
export const submitMissingPersonReport = async (req: Request, res: Response) => {
  try {
    console.log('Received missing person report submission:', req.body);
    console.log('Files received:', req.files);
    
    const { personName, age, lastSeen, description, contactInfo, urgency, reporter, village, location } = req.body;
    const images = req.files as Express.Multer.File[];

    const report = {
      id: Date.now(),
      personName: personName || 'Unknown',
      age: parseInt(age) || 0,
      lastSeen: lastSeen || 'Unknown',
      description: description || '',
      contactInfo: contactInfo || '',
      urgency: urgency || 'medium',
      images: images ? images.map(img => ({
        id: Date.now() + Math.random(),
        filename: img.filename,
        originalName: img.originalname,
        url: `/uploads/${img.filename}`,
        caption: img.originalname
      })) : [],
      reporter: reporter || 'Anonymous',
      village: village || 'Unknown',
      timestamp: new Date().toISOString(),
      status: 'searching',
      location: location ? JSON.parse(location) : [0, 0],
      adminNotes: '',
      searchStatus: 'active'
    };

    missingPersonReports.unshift(report);
    console.log('Missing person report created:', report);

    res.status(201).json({
      success: true,
      message: 'Missing person report submitted successfully',
      data: report
    });
  } catch (error) {
    console.error('Error submitting missing person report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit missing person report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getMissingPersonReports = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    
    let filteredReports = [...missingPersonReports];
    
    if (status && status !== 'all') {
      filteredReports = filteredReports.filter(report => report.status === status);
    }
    
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredReports = filteredReports.filter(report => 
        report.personName.toLowerCase().includes(searchTerm) ||
        report.reporter.toLowerCase().includes(searchTerm) ||
        report.village.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      success: true,
      data: filteredReports,
      total: filteredReports.length
    });
  } catch (error) {
    console.error('Error fetching missing person reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch missing person reports',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateMissingPersonStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const reportIndex = missingPersonReports.findIndex(report => report.id === parseInt(id));
    
    if (reportIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Missing person report not found'
      });
    }

    missingPersonReports[reportIndex].status = status;
    missingPersonReports[reportIndex].searchStatus = status === 'found' ? 'resolved' : 'active';
    if (adminNotes) {
      missingPersonReports[reportIndex].adminNotes = adminNotes;
    }

    res.json({
      success: true,
      message: 'Missing person status updated successfully',
      data: missingPersonReports[reportIndex]
    });
  } catch (error) {
    console.error('Error updating missing person status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update missing person status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Serve uploaded images
export const serveImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '../../uploads', filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export { upload };
