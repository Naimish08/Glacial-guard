import { Router } from 'express';
import { 
  sendSMSAlert, 
  sendWhatsAppAlert, 
  sendEmergencyAlert, 
  testAlert 
} from '../controllers/alertController.ts';

const router = Router();

router.post('/sms', sendSMSAlert);
router.post('/whatsapp', sendWhatsAppAlert);
router.post('/emergency', sendEmergencyAlert);
router.post('/test', testAlert);

export default router;
