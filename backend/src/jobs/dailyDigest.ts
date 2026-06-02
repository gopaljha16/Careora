import cron from 'node-cron';
import { sendDailyDigests } from '../services/digestService';

const cronExpression = process.env.DAILY_DIGEST_CRON || '0 14 * * *'; // Default: 8 PM IST

console.log(`[Cron] Scheduling daily digest with cron: ${cronExpression}`);

cron.schedule(cronExpression, () => {
  console.log(`[Cron] Triggering daily digests at ${new Date().toISOString()}`);
  sendDailyDigests();
});
