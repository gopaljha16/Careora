"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../lib/prisma");
const digestService_1 = require("../services/digestService");
const cronExpression = process.env.DAILY_DIGEST_CRON || '* * * * *';
node_cron_1.default.schedule(cronExpression, async () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueUsers = await prisma_1.prisma.user.findMany({
        where: {
            emailNotifications: true,
            reminderEnabled: true,
            reminderTime: currentTime,
        },
        select: { id: true, lastReminderSentAt: true },
    });
    for (const user of dueUsers) {
        const alreadySentToday = user.lastReminderSentAt && user.lastReminderSentAt >= today;
        if (alreadySentToday) {
            continue;
        }
        console.log(`[Cron] Sending reminder to user ${user.id} at ${currentTime}`);
        await (0, digestService_1.sendDigestForUser)(user.id);
    }
});
