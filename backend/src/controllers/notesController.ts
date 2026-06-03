import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const listNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notes = await prisma.applicationNote.findMany({
      where: { applicationId: req.params.applicationId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const note = await prisma.applicationNote.create({
      data: {
        applicationId: req.params.applicationId,
        content: req.body.content,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};
