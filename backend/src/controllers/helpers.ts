import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const verifyApplicationOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { applicationId } = req.params;
  const userId = req.user!.id;

  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  });

  if (!application) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  next();
};
