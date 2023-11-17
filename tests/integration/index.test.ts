import { createPool } from 'mysql2/promise';
import request from 'supertest';
import type { Express } from 'express';
import type { Server } from 'http';
import type { Server as SocketIOServer } from 'socket.io';

import { seedTestDatabase } from '../../seeds/test';
import { pool, testConfig } from '../../src/connections/mysql';
import { redisClients } from '../../src/connections/redis';
import { app, httpServer, socketIOServer  } from '../../src/app';

// No Bullshit Cooking API Integration Tests
//
// Register and run all integration tests from this file.
// Avoid global seeds and fixtures, add data per test (per it).

describe('NOBSC API', () => {
  let testApp: Express | null;
  let testHttpServer: Server | null;
  let testSocketIOServer: SocketIOServer | null;

  beforeAll(() => {
    console.log('Integration tests started.');
    testApp = app;
    testHttpServer = httpServer;
    testSocketIOServer = socketIOServer;
  });

  /*afterEach(async () => {
    testSocketIOServer?.disconnectSockets(false);
  
    await redisClients.pubClient.flushdb();
    await redisClients.sessionClient.flushdb();
  
    await truncateTestDatabase();
  });*/
  
  afterAll(async () => {
    //redisClients.pubClient.disconnect();
    //redisClients.subClient.disconnect();
    //redisClients.sessionClient.disconnect();
    await redisClients.pubClient.quit((err, result) => {
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
    });
    await pool.end();
    testSocketIOServer?.close();
    testHttpServer?.close();
    console.log('Integration tests finished.');
  });

  describe('GET /v1', () => {
    it('works', async () => {
      const res = await request(testApp).get('/v1');
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
