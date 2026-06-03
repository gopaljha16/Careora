import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { getReminderSettings, updateReminderSettings } from '../controllers/settingsController';

const router = Router();

router.use(authMiddleware);

router.get('/reminder', getReminderSettings);

router.put(
  '/reminder',
  [body('reminderTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('reminderTime must be in HH:mm format')],
  validateRequest,
  updateReminderSettings
);

export default router;
