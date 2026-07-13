"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterview = exports.listInterviews = void 0;
const prisma_1 = require("../lib/prisma");
const listInterviews = async (req, res, next) => {
    try {
        const interviews = await prisma_1.prisma.interviewRound.findMany({
            where: { applicationId: req.params.applicationId },
            orderBy: { scheduledAt: 'asc' },
        });
        res.json(interviews);
    }
    catch (error) {
        next(error);
    }
};
exports.listInterviews = listInterviews;
const createInterview = async (req, res, next) => {
    try {
        const { roundType, scheduledAt, outcome, notes } = req.body;
        const interview = await prisma_1.prisma.interviewRound.create({
            data: {
                applicationId: req.params.applicationId,
                roundType,
                scheduledAt: new Date(scheduledAt),
                outcome,
                notes,
            },
        });
        res.status(201).json(interview);
    }
    catch (error) {
        next(error);
    }
};
exports.createInterview = createInterview;
