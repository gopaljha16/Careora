"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReminderSettings = exports.getReminderSettings = void 0;
const prisma_1 = require("../lib/prisma");
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const getReminderSettings = async (req, res, next) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { reminderEnabled: true, reminderTime: true, emailNotifications: true },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({
            reminderEnabled: user.reminderEnabled,
            reminderTime: user.reminderTime,
            emailNotifications: user.emailNotifications,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReminderSettings = getReminderSettings;
const updateReminderSettings = async (req, res, next) => {
    try {
        const { reminderEnabled, reminderTime, emailNotifications } = req.body;
        if (reminderTime !== undefined && typeof reminderTime !== 'string') {
            res.status(400).json({ error: 'reminderTime must be a string in HH:mm format' });
            return;
        }
        if (reminderTime !== undefined && !TIME_PATTERN.test(reminderTime)) {
            res.status(400).json({ error: 'reminderTime must be in HH:mm format' });
            return;
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(typeof reminderEnabled === 'boolean' ? { reminderEnabled } : {}),
                ...(reminderTime ? { reminderTime } : {}),
                ...(typeof emailNotifications === 'boolean' ? { emailNotifications } : {}),
            },
            select: { reminderEnabled: true, reminderTime: true, emailNotifications: true },
        });
        res.json(updatedUser);
    }
    catch (error) {
        next(error);
    }
};
exports.updateReminderSettings = updateReminderSettings;
