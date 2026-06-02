import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient, ApplicationStatus } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
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

/**
 * GET /api/applications
 * Returns all applications for the logged-in user
 */
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const applications = await prisma.application.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(applications);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/applications
 * Creates a job and an associated application
 */
router.post(
  '/',
  [
    body('company').notEmpty().withMessage('Company is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('status').isIn(Object.values(ApplicationStatus)).withMessage('Invalid status'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { company, role, jobUrl, location, salary, description, status, source, notes } = req.body;

      const job = await prisma.job.create({
        data: {
          userId,
          company,
          role,
          jobUrl,
          location,
          salary,
          description,
          applications: {
            create: {
              userId,
              status,
              source,
              notes,
              appliedAt: status !== ApplicationStatus.WISHLIST ? new Date() : null,
            },
          },
        },
        include: { applications: true },
      });

      res.status(201).json(job.applications[0]);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/applications/:id
 * Single application detail
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const application = await prisma.application.findFirst({
      where: { id: req.params.id, userId },
      include: { job: true, appNotes: true, interviews: true },
    });

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/applications/:id
 * Updates application and optionally the job details
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { status, source, notes, job } = req.body;

    const existingApp = await prisma.application.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!existingApp) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    // Update job if provided
    if (job) {
      await prisma.job.update({
        where: { id: existingApp.jobId },
        data: {
          company: job.company,
          role: job.role,
          jobUrl: job.jobUrl,
          location: job.location,
          salary: job.salary,
          description: job.description,
        },
      });
    }

    // Update application
    const updatedApp = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status,
        source,
        notes,
        ...(status && status !== ApplicationStatus.WISHLIST && !existingApp.appliedAt ? { appliedAt: new Date() } : {}),
      },
      include: { job: true },
    });

    res.json(updatedApp);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/applications/:id
 * Deletes application (and associated job via cascade if it's the only application)
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const application = await prisma.application.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    await prisma.application.delete({
      where: { id: req.params.id },
    });

    // Option: Cleanup orphaned jobs (if a job has 0 applications, delete it)
    const jobApps = await prisma.application.count({ where: { jobId: application.jobId } });
    if (jobApps === 0) {
      await prisma.job.delete({ where: { id: application.jobId } });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
