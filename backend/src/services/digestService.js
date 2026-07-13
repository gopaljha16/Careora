"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDailyDigests = exports.sendDigestForUser = void 0;
const client_1 = require("@prisma/client");
const mailer_1 = require("./mailer");
const prisma = new client_1.PrismaClient();
const formatReminderText = (userName, todayCount, totalActive, interviewCount, offerCount, now) => `Hi ${userName},

Today's Activity:
• Applied to ${todayCount} jobs today ✅

Your Active Pipeline:
• ${totalActive} applications total
• ${interviewCount} in Interview stage 🎯
• ${offerCount} Offer pending 🎉

💡 Remember: Aim for 2–5 applications per day!

View Dashboard: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
`;
const sendDigestForUser = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.emailNotifications) {
        return;
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayCount = await prisma.application.count({
        where: { userId, appliedAt: { gte: today } },
    });
    const activeApps = await prisma.application.findMany({
        where: {
            userId,
            status: {
                in: [client_1.ApplicationStatus.APPLIED, client_1.ApplicationStatus.PHONE_SCREEN, client_1.ApplicationStatus.INTERVIEW, client_1.ApplicationStatus.OFFER],
            },
        },
        select: { status: true },
    });
    const totalActive = activeApps.length;
    const interviewCount = activeApps.filter((application) => application.status === client_1.ApplicationStatus.INTERVIEW).length;
    const offerCount = activeApps.filter((application) => application.status === client_1.ApplicationStatus.OFFER).length;
    const subject = `📋 Your Careora Daily Digest — ${now.toLocaleDateString()}`;
    const text = formatReminderText(user.name, todayCount, totalActive, interviewCount, offerCount, now);
    await (0, mailer_1.sendMail)(user.email, subject, text);
    await prisma.user.update({
        where: { id: user.id },
        data: { lastReminderSentAt: now },
    });
};
exports.sendDigestForUser = sendDigestForUser;
const sendDailyDigests = async () => {
    try {
        console.log('[DigestService] Starting daily digest generation...');
        const users = await prisma.user.findMany({
            where: { emailNotifications: true },
        });
        for (const user of users) {
            await (0, exports.sendDigestForUser)(user.id);
        }
        console.log('[DigestService] Daily digests sent successfully.');
    }
    catch (error) {
        console.error('[DigestService] Error sending daily digests:', error);
    }
};
exports.sendDailyDigests = sendDailyDigests;
