import { Router } from 'express';
import { 
  sendSMSAlert, 
  sendWhatsAppAlert, 
  sendEmergencyAlert, 
  testAlert,
  sendMultilingualEmergencyAlert
} from '../controllers/alertController.js';

const router = Router();

router.post('/sms', sendSMSAlert);
router.post('/whatsapp', sendWhatsAppAlert);
router.post('/emergency', sendEmergencyAlert);
router.post('/multilingual-emergency', sendMultilingualEmergencyAlert);
router.post('/test', testAlert);

export default router;
