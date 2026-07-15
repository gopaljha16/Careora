import { NextFunction, Request, Response } from 'express';
import { ApplicationStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const listApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { updatedAt: 'desc' },
      take: 1000, // Hard cap to prevent massive payload memory exhaustion
    });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { company, role, jobUrl, location, salary, description, status, source, notes, platform, isReferral, referralName, resumeVersion, coverLetterNotes } = req.body;

    const job = await prisma.job.create({
      data: {
        userId,
        company,
        role,
        jobUrl,
        location,
        salary,
        description,
        applications: {
          create: {
            userId,
            status,
            source,
            notes,
            platform,
            isReferral,
            referralName,
            resumeVersion,
            coverLetterNotes,
            appliedAt: status !== ApplicationStatus.WISHLIST ? new Date() : null,
          },
        },
      },
      include: { applications: true },
    });

    res.status(201).json(job.applications[0]);
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;

    const application = await prisma.application.findFirst({
      where: { id: req.params.id, userId },
      include: { job: true, appNotes: true, interviews: true },
    });

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { status, source, notes, job, platform, isReferral, referralName, resumeVersion, coverLetterNotes } = req.body;

    const existingApp = await prisma.application.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!existingApp) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    if (job) {
      await prisma.job.update({
        where: { id: existingApp.jobId },
        data: {
          company: job.company,
          role: job.role,
          jobUrl: job.jobUrl,
          location: job.location,
          salary: job.salary,
          description: job.description,
        },
      });
    }

    const updatedApp = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status,
        source,
        notes,
        platform,
        isReferral: isReferral !== undefined ? isReferral : existingApp.isReferral,
        referralName: referralName !== undefined ? referralName : existingApp.referralName,
        resumeVersion: resumeVersion !== undefined ? resumeVersion : existingApp.resumeVersion,
        coverLetterNotes: coverLetterNotes !== undefined ? coverLetterNotes : existingApp.coverLetterNotes,
        ...(status && status !== ApplicationStatus.WISHLIST && !existingApp.appliedAt ? { appliedAt: new Date() } : {}),
      },
      include: { job: true },
    });

    res.json(updatedApp);
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;

    const application = await prisma.application.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    await prisma.application.delete({ where: { id: req.params.id } });

    const jobApps = await prisma.application.count({ where: { jobId: application.jobId } });
    if (jobApps === 0) {
      await prisma.job.delete({ where: { id: application.jobId } });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
