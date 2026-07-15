import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const getReminderSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { reminderEnabled: true, reminderTime: true, emailNotifications: true, dailyGoal: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      reminderEnabled: user.reminderEnabled,
      reminderTime: user.reminderTime,
      emailNotifications: user.emailNotifications,
      dailyGoal: user.dailyGoal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReminderSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reminderEnabled, reminderTime, emailNotifications, dailyGoal } = req.body;

    if (reminderTime !== undefined && typeof reminderTime !== 'string') {
      res.status(400).json({ error: 'reminderTime must be a string in HH:mm format' });
      return;
    }

    if (reminderTime !== undefined && !TIME_PATTERN.test(reminderTime)) {
      res.status(400).json({ error: 'reminderTime must be in HH:mm format' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(typeof reminderEnabled === 'boolean' ? { reminderEnabled } : {}),
        ...(reminderTime ? { reminderTime } : {}),
        ...(typeof emailNotifications === 'boolean' ? { emailNotifications } : {}),
        ...(typeof dailyGoal === 'number' ? { dailyGoal } : {}),
      },
      select: { reminderEnabled: true, reminderTime: true, emailNotifications: true, dailyGoal: true },
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
