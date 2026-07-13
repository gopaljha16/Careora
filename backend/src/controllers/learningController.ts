import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const listLearningEntries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const entries = await prisma.learningEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 100,
    });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

export const getTodayLearningEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const entry = await prisma.learningEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });
    res.json(entry || null);
  } catch (error) {
    next(error);
  }
};

export const getYesterdayLearningEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    const entry = await prisma.learningEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date: yesterday,
        },
      },
    });
    res.json(entry || null);
  } catch (error) {
    next(error);
  }
};

export const upsertLearningEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { content, missed, date } = req.body;
    
    const dateObj = date ? new Date(date) : new Date();
    const targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    const entry = await prisma.learningEntry.upsert({
      where: {
        userId_date: {
          userId,
          date: targetDate,
        },
      },
      update: { content, missed },
      create: {
        userId,
        date: targetDate,
        content,
        missed,
      },
    });
    res.json(entry);
  } catch (error) {
    next(error);
  }
};
