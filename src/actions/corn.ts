// lib/cron.ts
import cron from 'node-cron';
import { deleteOldDeltedJobs, sendDailyJobNotifications, updateExpiredJobs } from './job.action';

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


export const scheduleDailyJobNotifications = () => {
  // Run every day at midnight (00:00)
  // Syntax: minute hour day-of-month month day-of-week
  const task = cron.schedule('0 0 * * *', async () => {
    try {
      // logger.info('Starting daily job notifications process');
      
      const result = await sendDailyJobNotifications();
      
      // if (result.success) {
      //   logger.info(`Daily job notifications sent successfully. 
      //     Jobs processed: ${result.jobsSent}, 
      //     Users notified: ${result.userNotificationsSent}`);
      // } else {
      //   logger.error('Failed to send daily job notifications', result.error);
      // }

    } catch (error) {
      console.log(error,"error")
      
      // logger.error('Unexpected error in daily job notifications scheduler', error);
    }
  }, {
    scheduled: true,
    timezone: "UTC" // Set to your specific timezone
  });

  return task;
};
