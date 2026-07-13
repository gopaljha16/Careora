"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.getApplication = exports.createApplication = exports.listApplications = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const listApplications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const applications = await prisma_1.prisma.application.findMany({
            where: { userId },
            include: { job: true },
            orderBy: { updatedAt: 'desc' },
            take: 1000, // Hard cap to prevent massive payload memory exhaustion
        });
        res.json(applications);
    }
    catch (error) {
        next(error);
    }
};
exports.listApplications = listApplications;
const createApplication = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { company, role, jobUrl, location, salary, description, status, source, notes, platform, isReferral, referralName } = req.body;
        const job = await prisma_1.prisma.job.create({
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
                        appliedAt: status !== client_1.ApplicationStatus.WISHLIST ? new Date() : null,
                    },
                },
            },
            include: { applications: true },
        });
        res.status(201).json(job.applications[0]);
    }
    catch (error) {
        next(error);
    }
};
exports.createApplication = createApplication;
const getApplication = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const application = await prisma_1.prisma.application.findFirst({
            where: { id: req.params.id, userId },
            include: { job: true, appNotes: true, interviews: true },
        });
        if (!application) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }
        res.json(application);
    }
    catch (error) {
        next(error);
    }
};
exports.getApplication = getApplication;
const updateApplication = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status, source, notes, job, platform, isReferral, referralName } = req.body;
        const existingApp = await prisma_1.prisma.application.findFirst({
            where: { id: req.params.id, userId },
        });
        if (!existingApp) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }
        if (job) {
            await prisma_1.prisma.job.update({
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
        const updatedApp = await prisma_1.prisma.application.update({
            where: { id: req.params.id },
            data: {
                status,
                source,
                notes,
                platform,
                isReferral: isReferral !== undefined ? isReferral : existingApp.isReferral,
                referralName: referralName !== undefined ? referralName : existingApp.referralName,
                ...(status && status !== client_1.ApplicationStatus.WISHLIST && !existingApp.appliedAt ? { appliedAt: new Date() } : {}),
            },
            include: { job: true },
        });
        res.json(updatedApp);
    }
    catch (error) {
        next(error);
    }
};
exports.updateApplication = updateApplication;
const deleteApplication = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const application = await prisma_1.prisma.application.findFirst({
            where: { id: req.params.id, userId },
        });
        if (!application) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }
        await prisma_1.prisma.application.delete({ where: { id: req.params.id } });
        const jobApps = await prisma_1.prisma.application.count({ where: { jobId: application.jobId } });
        if (jobApps === 0) {
            await prisma_1.prisma.job.delete({ where: { id: application.jobId } });
        }
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteApplication = deleteApplication;
