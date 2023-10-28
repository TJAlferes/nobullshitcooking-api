import { CronJob } from 'cron';
import * as dotenv from 'dotenv';

dotenv.config();

import { userCron } from './modules/user/cron.js';
import { createAppServer } from './app.js';

export const userCronJob = new CronJob('0 0 * * *', async () => {
  await userCron.deleteStaleUnconfirmed();  // cleans up abandoned, unconfirmed user accounts
});

export const { httpServer, socketIOServer } = createAppServer();

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
});
