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
      where: { userId_date: { userId, date: today } },
    });
    // Return {} (not null) so the frontend can safely check .content / .missed
    res.json(entry ?? {});
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
      where: { userId_date: { userId, date: yesterday } },
    });
    res.json(entry ?? {});
  } catch (error) {
    next(error);
  }
};

export const upsertLearningEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { content, missed, date } = req.body;

    // content is non-nullable in the schema — default to empty string if omitted
    const safeContent = (content ?? '').toString().trim();
    const safeMissed  = (missed  ?? '').toString().trim();

    const dateObj  = date ? new Date(date) : new Date();
    const targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    const entry = await prisma.learningEntry.upsert({
      where: { userId_date: { userId, date: targetDate } },
      update: { content: safeContent, missed: safeMissed },
      create: { userId, date: targetDate, content: safeContent, missed: safeMissed },
    });
    res.json(entry);
  } catch (error) {
    next(error);
  }
};
