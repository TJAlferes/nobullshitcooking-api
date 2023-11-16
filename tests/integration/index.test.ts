import { createPool } from 'mysql2/promise';
import request from 'supertest';

import { seedTestDatabase } from '../../seeds/test';
import { pool, testConfig } from '../../src/connections/mysql';
import { redisClients } from '../../src/connections/redis';
import { userCronJob, passwordResetCronJob, startServer } from '../../src';

// No Bullshit Cooking API Integration Tests
//
// Register and run all integration tests from this file.
// Avoid global seeds and fixtures, add data per test (per it).

export const { app, httpServer, socketIOServer } = startServer();


beforeAll(() => {
  console.log('Integration tests started.');
});

afterAll(async () => {
  await pool.end();

  //socketIOServer?.removeAllListeners();
  //socketIOServer?.disconnectSockets(false);
  socketIOServer?.close(err => console.log(err?.message));

  await redisClients.pubClient.quit();
  await redisClients.subClient.quit();
  await redisClients.sessionClient.quit();

  userCronJob.stop();
  passwordResetCronJob.stop();

  //httpServer.removeAllListeners();
  //httpServer.closeAllConnections();
  httpServer.close();

  console.log('Integration tests finished.');
});

afterEach(async () => {
  socketIOServer?.disconnectSockets(false);

  await redisClients.pubClient.flushdb();
  await redisClients.sessionClient.flushdb();

  await truncateTestDatabase();
});

describe('NOBSC API', () => {
  describe('GET /v1', () => {
    it('works', async () => {
      const res = await request(app).get('/v1');
      expect(res.text).toBe('No Bullshit Cooking API\nDocumentation at https://github.com/tjalferes/nobullshitcooking-api');
    });
  });
});

const tableNames = [
  'user',
  'password_reset',
  'image',
  'user_image',
  'friendship',
  'equipment',
  'ingredient',
  'ingredient_alt_name',
  'recipe',
  'recipe_image',
  'recipe_equipment',
  'recipe_ingredient',
  'recipe_method',
  'recipe_subrecipe',
  'favorite_recipe',
  'saved_recipe',
  'plan',
  'plan_recipe',
];

async function truncateTestDatabase() {
  // Ensure this touches ONLY test DBs, NEVER prod DBs!!!
  // To that end, we use a separate pool here (instead of src/connections/mysql.ts).
  const pool = createPool(testConfig);

  try {
    console.log('Reset test MySQL DB tables begin.');

    for (const tableName of tableNames.reverse()) {
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        await conn.execute('SET foreign_key_checks = 0');
        await conn.execute(`TRUNCATE TABLE ${tableName}`);
        await conn.execute('SET foreign_key_checks = 1');
        await conn.commit();
      } catch (error) {
        await conn.rollback();
        throw error;
      }finally {
        conn.release();
      }
    }

    await seedTestDatabase();

    console.log('Reset test MySQL DB tables success.');
  } catch (error) {
    console.error('Reset test MySQL DB tables error:', error);
  } finally {
    await pool.end();
  }
}

/*const tableNames = [
  'user',
  'password_reset',
  'image',
  'user_image',
  'friendship',
  //'chatgroup',
  //'chatroom',
  //'chatmessage',
  //'chatgroup_user',
  //'chatroom_user',
  'equipment',
  'ingredient',
  //'ingredient_alt_name',
  'recipe',
  //'recipe_image',
  //'recipe_equipment',
  //'recipe_ingredient',
  //'recipe_method',
  //'recipe_subrecipe',
  'favorite_recipe',
  'saved_recipe',
  'plan',
  //'plan_recipe',
];*/
