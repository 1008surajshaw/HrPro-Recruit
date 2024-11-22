// lib/cron.ts
import cron from 'node-cron';
import { deleteOldDeltedJobs, updateExpiredJobs } from './job.action';

let cronJobInitialized = false;

export const startCronJob = () => {
  if (!cronJobInitialized) {
    cronJobInitialized = true;

    cron.schedule('0 0 * * *', async () => {
      try {
        await updateExpiredJobs();
        await deleteOldDeltedJobs();
      } catch (error) {
        console.error('Error updating expired jobs:', error);
      }
    });
  }
};
