import { CronJob } from 'cron';
import * as dotenv from 'dotenv';

dotenv.config();

import { userCron } from './modules/user/cron';
import { passwordResetCron } from './modules/user/authentication/password-reset/cron';
import { httpServer } from './app';
import { testMySQLConnection } from './connections/mysql';
import { connectRedisClient, redisClients } from './connections/redis';

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

export async function startServer() {
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

  await testMySQLConnection();
  await connectRedisClient(redisClients.sessionClient);
  await connectRedisClient(redisClients.pubClient);
  await connectRedisClient(redisClients.subClient);
}

startServer();
