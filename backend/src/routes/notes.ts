import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

// Merge params to access :applicationId from the parent router
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
 * GET /api/applications/:applicationId/notes
 */
router.get('/', verifyApplication, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notes = await prisma.applicationNote.findMany({
      where: { applicationId: req.params.applicationId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/applications/:applicationId/notes
 */
router.post(
  '/',
  verifyApplication,
  [body('content').notEmpty().withMessage('Content is required')],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const note = await prisma.applicationNote.create({
        data: {
          applicationId: req.params.applicationId,
          content: req.body.content,
        },
      });
      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
