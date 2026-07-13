"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNote = exports.listNotes = void 0;
const prisma_1 = require("../lib/prisma");
const listNotes = async (req, res, next) => {
    try {
        const notes = await prisma_1.prisma.applicationNote.findMany({
            where: { applicationId: req.params.applicationId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notes);
    }
    catch (error) {
        next(error);
    }
};
exports.listNotes = listNotes;
const createNote = async (req, res, next) => {
    try {
        const note = await prisma_1.prisma.applicationNote.create({
            data: {
                applicationId: req.params.applicationId,
                content: req.body.content,
            },
        });
        res.status(201).json(note);
    }
    catch (error) {
        next(error);
    }
};
exports.createNote = createNote;
