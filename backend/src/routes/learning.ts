import { Router } from 'express';
import {
  listLearningEntries,
  getTodayLearningEntry,
  getYesterdayLearningEntry,
  getHeatmapData,
  upsertLearningEntry,
} from '../controllers/learningController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', listLearningEntries);
router.get('/today', getTodayLearningEntry);
router.get('/yesterday', getYesterdayLearningEntry);
router.get('/heatmap', getHeatmapData);
router.post('/', upsertLearningEntry);

export default router;
