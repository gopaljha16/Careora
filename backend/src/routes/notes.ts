import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { verifyApplicationOwnership } from '../controllers/helpers';
import { createNote, listNotes } from '../controllers/notesController';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', verifyApplicationOwnership, listNotes);

router.post(
  '/',
  verifyApplicationOwnership,
  [body('content').notEmpty().withMessage('Content is required')],
  validateRequest,
  createNote
);

export default router;
