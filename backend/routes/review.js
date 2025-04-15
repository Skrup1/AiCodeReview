import { Router } from 'express';
import { analyzeCode } from '../controllers/reviewController.js';

const router = Router();

router.post('/', analyzeCode);

export default router;
