import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { sendDigestForUser } from '../services/digestService';

const cronExpression = process.env.DAILY_DIGEST_CRON || '* * * * *';

cron.schedule(cronExpression, async () => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dueUsers = await prisma.user.findMany({
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
    await sendDigestForUser(user.id);
  }
});
