import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const listInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await prisma.interviewRound.findMany({
      where: { applicationId: req.params.applicationId },
      orderBy: { scheduledAt: 'asc' },
    });

    res.json(interviews);
  } catch (error) {
    next(error);
  }
};

export const createInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
};
