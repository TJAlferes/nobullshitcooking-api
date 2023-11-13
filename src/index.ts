import { CronJob } from 'cron';
import * as dotenv from 'dotenv';

dotenv.config();

import { userCron } from './modules/user/cron.js';
import { passwordResetCron } from './modules/user/authentication/password-reset/cron.js';
import { createAppServer } from './app.js';

export const userCronJob = new CronJob(
  '0 0 0 * * *',  // every day at midnight
  async function () {
    await userCron.deleteStaleUnconfirmed();  // cleans up abandoned, unconfirmed user accounts
  }
);

export const passwordResetCronJob = new CronJob(
  '0 0 0 * * *',  // every day at midnight
  async function () {
    await passwordResetCron.deleteExpiredTemporaryPasswords();
  }
);

export function startServer() {
  const { httpServer, socketIOServer } = createAppServer();

  const PORT = process.env.NODE_ENV === 'production'
    ? Number(process.env.PORT) || 8081
    : Number(process.env.PORT) || 3003;

  const HOST = process.env.NODE_ENV === 'production'
    ? '127.0.0.1'
    : '0.0.0.0';

  httpServer.listen(PORT, HOST, () => {
    console.log('HTTP server listening on port ' + PORT);
    // TO DO: For horizontal scaling, move crons to leader server or separate cron server
    userCronJob.start();
    passwordResetCronJob.start();
  });

  return {httpServer, socketIOServer};
}

startServer();
