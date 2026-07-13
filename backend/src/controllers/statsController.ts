import { NextFunction, Request, Response } from 'express';
import { ApplicationStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

    const totalApplications = await prisma.application.count({ where: { userId } });
    const todayApplications = await prisma.application.count({
      where: { userId, appliedAt: { gte: today } },
    });
    const weekApplications = await prisma.application.count({
      where: { userId, appliedAt: { gte: weekAgo } },
    });
    const activePipeline = await prisma.application.count({
      where: {
        userId,
        status: {
          in: [ApplicationStatus.APPLIED, ApplicationStatus.PHONE_SCREEN, ApplicationStatus.INTERVIEW, ApplicationStatus.OFFER],
        },
      },
    });

    const statusGroups = await prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });

    const byStatus = statusGroups.map((group) => ({
      status: group.status,
      count: group._count.id,
    }));

    const recentApps = await prisma.application.findMany({
      where: { userId, appliedAt: { gte: fourteenDaysAgo } },
      select: { appliedAt: true },
    });

    const dailyMap: Record<string, number> = {};
    for (let index = 13; index >= 0; index -= 1) {
      const day = new Date(now.getTime() - index * 24 * 60 * 60 * 1000);
      dailyMap[day.toISOString().split('T')[0]] = 0;
    }

    recentApps.forEach((application) => {
      if (application.appliedAt) {
        const dateKey = application.appliedAt.toISOString().split('T')[0];
        if (dailyMap[dateKey] !== undefined) {
          dailyMap[dateKey] += 1;
        }
      }
    });

    const applicationsPerDay = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    // Heatmap (365 days)
    const yearApps = await prisma.application.findMany({
      where: { userId, appliedAt: { gte: yearAgo } },
      select: { appliedAt: true },
    });
    
    const heatmapMap: Record<string, number> = {};
    yearApps.forEach((app) => {
      if (app.appliedAt) {
        const dateKey = app.appliedAt.toISOString().split('T')[0];
        heatmapMap[dateKey] = (heatmapMap[dateKey] || 0) + 1;
      }
    });
    const heatmapData = Object.entries(heatmapMap).map(([date, count]) => ({ date, count }));

    // Platform breakdown (last 30 days)
    const platformGroups = await prisma.application.groupBy({
      by: ['platform'],
      where: { userId, appliedAt: { gte: thirtyDaysAgo }, platform: { not: null } },
      _count: { id: true },
    });
    const platformBreakdown = platformGroups.map(p => ({ platform: p.platform, count: p._count.id }));

    // Referral stats
    const totalRecentApps = await prisma.application.count({
      where: { userId, appliedAt: { gte: thirtyDaysAgo } }
    });
    const referralAppsCount = await prisma.application.count({
      where: { userId, appliedAt: { gte: thirtyDaysAgo }, isReferral: true }
    });
    const referralStats = {
      total: totalRecentApps,
      referrals: referralAppsCount,
      direct: totalRecentApps - referralAppsCount,
      percentage: totalRecentApps > 0 ? Math.round((referralAppsCount / totalRecentApps) * 100) : 0
    };

    res.json({
      totalApplications,
      todayApplications,
      weekApplications,
      activePipeline,
      byStatus,
      applicationsPerDay,
      heatmapData,
      platformBreakdown,
      referralStats,
    });
  } catch (error) {
    next(error);
  }
};
