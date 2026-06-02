import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient, RoundType } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router({ mergeParams: true });
const prisma = new PrismaClient();

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Validation failed', details: errors.array() });
    return;
  }
  next();
};

router.use(authMiddleware);

// Middleware to ensure application belongs to user
const verifyApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const applicationId = req.params.applicationId;
  const userId = req.user!.id;

  const app = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  });

  if (!app) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  next();
};

/**
 * GET /api/applications/:applicationId/interviews
 */
router.get('/', verifyApplication, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await prisma.interviewRound.findMany({
      where: { applicationId: req.params.applicationId },
      orderBy: { scheduledAt: 'asc' },
    });
    res.json(interviews);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/applications/:applicationId/interviews
 */
router.post(
  '/',
  verifyApplication,
  [
    body('roundType').isIn(Object.values(RoundType)).withMessage('Invalid round type'),
    body('scheduledAt').isISO8601().withMessage('Valid scheduled date is required'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { roundType, scheduledAt, outcome, notes } = req.body;
      const interview = await prisma.interviewRound.create({
        data: {
          applicationId: req.params.applicationId,
          roundType,
          scheduledAt: new Date(scheduledAt),
          outcome,
          notes,
        },
      });
      res.status(201).json(interview);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
