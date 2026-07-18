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

export const getHeatmapData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const days = parseInt((req.query.days as string) || '180', 10);
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days + 1);

    const entries = await prisma.learningEntry.findMany({
      where: { userId, date: { gte: from } },
      select: { date: true, dayRating: true, wakeUpTime: true, sleepTime: true, instaScreenTime: true },
      orderBy: { date: 'asc' },
    });

    res.json(
      entries.map((e) => ({
        date: e.date.toISOString().split('T')[0],
        rating: e.dayRating ?? null,
        wakeUpTime: e.wakeUpTime ?? null,
        sleepTime: e.sleepTime ?? null,
        instaScreenTime: e.instaScreenTime ?? null,
      }))
    );
  } catch (error) {
    next(error);
  }
};

export const upsertLearningEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { content, missed, date, dayRating, wakeUpTime, sleepTime, instaScreenTime, daySummary } = req.body;

    const safeContent       = (content ?? '').toString().trim();
    const safeMissed        = (missed  ?? '').toString().trim();
    const safeDayRating     = dayRating    != null ? Math.max(1, Math.min(10, parseInt(dayRating, 10)))    : null;
    const safeWakeUpTime    = wakeUpTime   ? wakeUpTime.toString().trim()   : null;
    const safeSleepTime     = sleepTime    ? sleepTime.toString().trim()    : null;
    const safeInstaScreen   = instaScreenTime != null ? Math.max(0, parseInt(instaScreenTime, 10))         : null;
    const safeDaySummary    = daySummary   ? daySummary.toString().trim()   : null;

    const dateObj    = date ? new Date(date) : new Date();
    const targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    const entry = await prisma.learningEntry.upsert({
      where: { userId_date: { userId, date: targetDate } },
      update: {
        content: safeContent,
        missed: safeMissed,
        dayRating: safeDayRating,
        wakeUpTime: safeWakeUpTime,
        sleepTime: safeSleepTime,
        instaScreenTime: safeInstaScreen,
        daySummary: safeDaySummary,
      },
      create: {
        userId,
        date: targetDate,
        content: safeContent,
        missed: safeMissed,
        dayRating: safeDayRating,
        wakeUpTime: safeWakeUpTime,
        sleepTime: safeSleepTime,
        instaScreenTime: safeInstaScreen,
        daySummary: safeDaySummary,
      },
    });
    res.json(entry);
  } catch (error) {
    next(error);
  }
};
