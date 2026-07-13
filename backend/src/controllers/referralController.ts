import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const listReferralLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const logs = await prisma.dailyReferralLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 100,
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const getTodayReferralLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const logs = await prisma.dailyReferralLog.findMany({
      where: { userId, date: today },
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const upsertReferralLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { platform, count } = req.body;
    
    // Parse date if provided, otherwise use today
    const dateObj = req.body.date ? new Date(req.body.date) : new Date();
    const targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    const log = await prisma.dailyReferralLog.upsert({
      where: {
        userId_date_platform: {
          userId,
          date: targetDate,
          platform,
        },
      },
      update: { count },
      create: {
        userId,
        date: targetDate,
        platform,
        count,
      },
    });
    res.json(log);
  } catch (error) {
    next(error);
  }
};
