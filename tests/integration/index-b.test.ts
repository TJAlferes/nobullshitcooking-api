/*//import { createPool } from 'mysql2/promise';
import request from 'supertest';
//import assert from 'node:assert';

import { seedTestDatabase } from '../../seeds/test';
import { pool } from '../../src/connections/mysql';
import { redisClients } from '../../src/connections/redis';
import { app, httpServer, socketIOServer  } from '../../src/app';

async function runTest() {
  console.log('runTest');
  await seedTestDatabase();

  const agent = request.agent(app);

  await agent
    .post('/v1/login')
    .send({
      email: 'fakeuser1@gmail.com',
      password: 'fakepassword'
    });
    
  const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
  console.log(res.status);  //assert(res.status, '201'

  await agent.post('/v1/logout');

  await redisClients.pubClient.flushdb();
  await redisClients.sessionClient.flushdb();
  socketIOServer?.disconnectSockets(false);

  //await truncateTestDatabase();
  await redisClients.pubClient.quit();
  await redisClients.subClient.quit();
  await redisClients.sessionClient.quit();  // or .disconnect();
  await pool.end();
  socketIOServer?.close();
  httpServer?.close();
}

await runTest();
*/