import { Router } from 'express';
import { 
  submitCommunityReport, 
  getCommunityReports, 
  updateReportStatus,
  submitMissingPersonReport,
  getMissingPersonReports,
  updateMissingPersonStatus,
  serveImage,
  upload
} from '../controllers/communityController.ts';

const router = Router();

// Community Reports
router.post('/reports', upload.array('images', 5), submitCommunityReport);
router.get('/reports', getCommunityReports);
router.put('/reports/:id/status', updateReportStatus);

// Missing Person Reports
router.post('/missing-persons', upload.array('images', 5), submitMissingPersonReport);
router.get('/missing-persons', getMissingPersonReports);
router.put('/missing-persons/:id/status', updateMissingPersonStatus);

// Image serving
router.get('/uploads/:filename', serveImage);

export default router;
