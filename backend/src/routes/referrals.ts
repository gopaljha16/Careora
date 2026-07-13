import { Router } from 'express';
import { listReferralLogs, getTodayReferralLogs, upsertReferralLog } from '../controllers/referralController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', listReferralLogs);
router.get('/today', getTodayReferralLogs);
router.post('/', upsertReferralLog);

export default router;
