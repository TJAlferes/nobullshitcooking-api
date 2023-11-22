import { pool } from '../../src/connections/mysql';
import { redisClients } from '../../src/connections/redis';
import { httpServer, socketIOServer  } from '../../src/app';

export default async function cleanUp() {
  //await truncateTestDatabase();
  await redisClients.pubClient.quit();
  await redisClients.subClient.quit();
  await redisClients.sessionClient.quit();  // or .disconnect();
  await pool.end();
  socketIOServer?.close();
  httpServer?.close();
}
