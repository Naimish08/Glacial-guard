import { Router } from 'express';
import { getProcessedData } from '../controllers/dataController';

const router = Router();

router.get('/processed-data', getProcessedData);

export default router;