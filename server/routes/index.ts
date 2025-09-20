import { Router } from 'express';
import { getProcessedData } from '../controllers/dataController.ts';
import alertRoutes from './alerts.ts';
import communityRoutes from './community.ts';

const router = Router();

// Existing routes
router.get('/processed-data', getProcessedData);
router.use('/alerts', alertRoutes);
router.use('/community', communityRoutes);

// Add health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'GlacialGuard Alert System operational',
    timestamp: new Date().toISOString(),
    services: {
      sms: 'simulated',
      whatsapp: 'simulated', 
      alerts: 'ready',
      dataProcessing: 'ready'
    },
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

export default router;