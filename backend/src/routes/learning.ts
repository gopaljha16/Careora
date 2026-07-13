import { Router } from 'express';
import { listLearningEntries, getTodayLearningEntry, getYesterdayLearningEntry, upsertLearningEntry } from '../controllers/learningController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', listLearningEntries);
router.get('/today', getTodayLearningEntry);
router.get('/yesterday', getYesterdayLearningEntry);
router.post('/', upsertLearningEntry);

export default router;
