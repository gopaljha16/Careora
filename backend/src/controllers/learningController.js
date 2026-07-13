"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertLearningEntry = exports.getYesterdayLearningEntry = exports.getTodayLearningEntry = exports.listLearningEntries = void 0;
const prisma_1 = require("../lib/prisma");
const listLearningEntries = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const entries = await prisma_1.prisma.learningEntry.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 100,
        });
        res.json(entries);
    }
    catch (error) {
        next(error);
    }
};
exports.listLearningEntries = listLearningEntries;
const getTodayLearningEntry = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const entry = await prisma_1.prisma.learningEntry.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
        });
        res.json(entry || null);
    }
    catch (error) {
        next(error);
    }
};
exports.getTodayLearningEntry = getTodayLearningEntry;
const getYesterdayLearningEntry = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const entry = await prisma_1.prisma.learningEntry.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: yesterday,
                },
            },
        });
        res.json(entry || null);
    }
    catch (error) {
        next(error);
    }
};
exports.getYesterdayLearningEntry = getYesterdayLearningEntry;
const upsertLearningEntry = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { content, missed, date } = req.body;
        const dateObj = date ? new Date(date) : new Date();
        const targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        const entry = await prisma_1.prisma.learningEntry.upsert({
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
    }
    catch (error) {
        next(error);
    }
};
exports.upsertLearningEntry = upsertLearningEntry;
