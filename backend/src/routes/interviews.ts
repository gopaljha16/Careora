import { Router } from 'express';
import { body } from 'express-validator';
import { RoundType } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { verifyApplicationOwnership } from '../controllers/helpers';
import { createInterview, listInterviews } from '../controllers/interviewsController';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', verifyApplicationOwnership, listInterviews);

router.post(
  '/',
  verifyApplicationOwnership,
  [
    body('roundType').isIn(Object.values(RoundType)).withMessage('Invalid round type'),
    body('scheduledAt').isISO8601().withMessage('Valid scheduled date is required'),
  ],
  validateRequest,
  createInterview
);

export default router;
