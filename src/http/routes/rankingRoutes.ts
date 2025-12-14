import { Router } from 'express';
import { rankingController } from '../controllers/rankingController';

const router = Router();

router.get('/rank', rankingController);

export default router;
