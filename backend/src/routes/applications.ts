import { Router } from 'express';
import { body } from 'express-validator';
import { ApplicationStatus } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createApplication, deleteApplication, getApplication, listApplications, updateApplication } from '../controllers/applicationsController';

const router = Router();

router.use(authMiddleware);

router.get('/', listApplications);

router.post(
  '/',
  [
    body('company').notEmpty().withMessage('Company is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('status').isIn(Object.values(ApplicationStatus)).withMessage('Invalid status'),
  ],
  validateRequest,
  createApplication
);

router.get('/:id', getApplication);

router.put('/:id', updateApplication);

router.delete('/:id', deleteApplication);

export default router;
