import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, ApplicationStatus } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

/**
 * GET /api/stats
 * Returns dashboard statistics
 */
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Get today and week ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Total applications
    const totalApplications = await prisma.application.count({ where: { userId } });

    // Today's applications
    const todayApplications = await prisma.application.count({
      where: {
        userId,
        appliedAt: { gte: today },
      },
    });

    // This week's applications
    const weekApplications = await prisma.application.count({
      where: {
        userId,
        appliedAt: { gte: weekAgo },
      },
    });

    // Active pipeline (applied, phone screen, interview, offer)
    const activePipeline = await prisma.application.count({
      where: {
        userId,
        status: {
          in: [
            ApplicationStatus.APPLIED,
            ApplicationStatus.PHONE_SCREEN,
            ApplicationStatus.INTERVIEW,
            ApplicationStatus.OFFER,
          ],
        },
      },
    });

    // Group by status for Donut Chart
    const statusGroups = await prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });
    const byStatus = statusGroups.map((g) => ({
      status: g.status,
      count: g._count.id,
    }));

    // Daily breakdown for the last 14 days for Bar Chart
    const recentApps = await prisma.application.findMany({
      where: {
        userId,
        appliedAt: { gte: fourteenDaysAgo },
      },
      select: { appliedAt: true },
    });

    // Initialize map of last 14 dates with 0
    const dailyMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = d.toISOString().split('T')[0];
      dailyMap[dateString] = 0;
    }

    recentApps.forEach((app) => {
      if (app.appliedAt) {
        const dateString = app.appliedAt.toISOString().split('T')[0];
        if (dailyMap[dateString] !== undefined) {
          dailyMap[dateString]++;
        }
      }
    });

    const applicationsPerDay = Object.keys(dailyMap).map((date) => ({
      date,
      count: dailyMap[date],
    }));

    res.json({
      totalApplications,
      todayApplications,
      weekApplications,
      activePipeline,
      byStatus,
      applicationsPerDay,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
