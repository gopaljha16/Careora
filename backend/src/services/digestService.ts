import { ApplicationStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { sendMail } from './mailer';


const formatReminderText = (userName: string, todayCount: number, totalActive: number, interviewCount: number, offerCount: number, now: Date): string => `Hi ${userName},

Today's Activity:
• Applied to ${todayCount} jobs today ✅

Your Active Pipeline:
• ${totalActive} applications total
• ${interviewCount} in Interview stage 🎯
• ${offerCount} Offer pending 🎉

💡 Remember: Aim for 2–5 applications per day!

View Dashboard: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
`;

export const sendDigestForUser = async (userId: string): Promise<void> => {
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
        in: [ApplicationStatus.APPLIED, ApplicationStatus.PHONE_SCREEN, ApplicationStatus.INTERVIEW, ApplicationStatus.OFFER],
      },
    },
    select: { status: true },
  });

  const totalActive = activeApps.length;
  const interviewCount = activeApps.filter((application) => application.status === ApplicationStatus.INTERVIEW).length;
  const offerCount = activeApps.filter((application) => application.status === ApplicationStatus.OFFER).length;

  const subject = `📋 Your Careora Daily Digest — ${now.toLocaleDateString()}`;
  const text = formatReminderText(user.name, todayCount, totalActive, interviewCount, offerCount, now);

  await sendMail(user.email, subject, text);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastReminderSentAt: now },
  });
};

export const sendDailyDigests = async () => {
  try {
    console.log('[DigestService] Starting daily digest generation...');

    const users = await prisma.user.findMany({
      where: { emailNotifications: true },
    });

    for (const user of users) {
      await sendDigestForUser(user.id);
    }

    console.log('[DigestService] Daily digests sent successfully.');
  } catch (error) {
    console.error('[DigestService] Error sending daily digests:', error);
  }
};
