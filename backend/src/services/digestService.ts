import { PrismaClient, ApplicationStatus } from '@prisma/client';
import { sendMail } from './mailer';

const prisma = new PrismaClient();

export const sendDailyDigests = async () => {
  try {
    console.log('[DigestService] Starting daily digest generation...');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Fetch users with emailNotifications = true
    const users = await prisma.user.findMany({
      where: { emailNotifications: true },
    });

    for (const user of users) {
      // Today's applications
      const todayCount = await prisma.application.count({
        where: {
          userId: user.id,
          appliedAt: { gte: today },
        },
      });

      // Active pipeline
      const activeApps = await prisma.application.findMany({
        where: {
          userId: user.id,
          status: {
            in: [
              ApplicationStatus.APPLIED,
              ApplicationStatus.PHONE_SCREEN,
              ApplicationStatus.INTERVIEW,
              ApplicationStatus.OFFER,
            ],
          },
        },
        select: { status: true },
      });

      const totalActive = activeApps.length;
      const interviewCount = activeApps.filter((a) => a.status === ApplicationStatus.INTERVIEW).length;
      const offerCount = activeApps.filter((a) => a.status === ApplicationStatus.OFFER).length;

      const subject = `📋 Your Careora Daily Digest — ${now.toLocaleDateString()}`;

      const text = `Hi ${user.name},

Today's Activity:
• Applied to ${todayCount} jobs today ✅

Your Active Pipeline:
• ${totalActive} applications total
• ${interviewCount} in Interview stage 🎯
• ${offerCount} Offer pending 🎉

💡 Remember: Aim for 2–5 applications per day!

View Dashboard: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
`;

      await sendMail(user.email, subject, text);
    }

    console.log('[DigestService] Daily digests sent successfully.');
  } catch (error) {
    console.error('[DigestService] Error sending daily digests:', error);
  }
};
