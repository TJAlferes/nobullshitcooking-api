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

afterEach(async () => {
  redisClients.pubClient.disconnect();
  redisClients.subClient.disconnect();
  redisClients.sessionClient.disconnect();

  //socketIOServer?.removeAllListeners();
  //socketIOServer?.disconnectSockets(false);
  //await new Promise(() => socketIOServer?.close(err => console.log(err?.message)));
  socketIOServer?.close(err => console.log(err?.message));
  
  await new Promise(() => userCronJob.stop());
  await new Promise(() => passwordResetCronJob.stop());

  //await new Promise(() => httpServer.removeAllListeners());
  //httpServer.closeAllConnections();
  await new Promise(() => httpServer.close(err => {
    if (err) {
      console.error('httpServer.close() error: ', err);
    } else {
      console.log('httpServer.close() success.');
    }
  }));

  await pool.end();
});

afterAll(() => {
  console.log('Integration tests finished.');
});

/*afterEach(async () => {
  await new Promise(() => socketIOServer?.disconnectSockets(false));

  await redisClients.pubClient.flushdb();
  await redisClients.sessionClient.flushdb();

  await truncateTestDatabase();
});*/

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

/*await redisClients.pubClient.quit((err, result) => {
    if (err) {
      console.error('pubClient.quit() errror: ', err);
    } else {
      console.log('pubClient.quit() success.', result);
    }
  });
  await redisClients.subClient.quit((err, result) => {
    if (err) {
      console.error('subClient.quit() errror: ', err);
    } else {
      console.log('subClient.quit() success.', result);
    }
  });
  await redisClients.sessionClient.quit((err, result) => {
    if (err) {
      console.error('sessionClient.quit() errror: ', err);
    } else {
      console.log('sessionClient.quit() success.', result);
    }
  });*/
