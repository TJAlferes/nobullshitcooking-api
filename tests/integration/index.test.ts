import { createPool } from 'mysql2/promise';
import type { Server } from 'node:http';
import type { Server as SocketIOServer } from 'socket.io';
import request from 'supertest';

import { seedDatabase } from '../../seeds/index.js';  // TO DO: use a test specific seeder
import { pool, testConfig } from '../../src/connections/mysql.js';
import { redisClients } from '../../src/connections/redis.js';
import { httpServer, socketIOServer, userCronJob } from '../../src/index.js';
import {
  userAuthTests,
  userEquipmentTests,
  userFavoriteRecipeTests,
  //userFriendshipTests,
  userIngredientTests,
  userPlanTests,
  userRecipeTests,
  userSavedRecipeTests,
  userTests
} from './user/index.js';
import {
  //AwsS3Tests,
  cuisineTests,
  equipmentTests,
  equipmentTypeTests,
  ingredientTests,
  ingredientTypeTests,
  methodTests,
  recipeTests,
  recipeTypeTests,
  searchTests,
  unitTests
} from './index.js';

// No Bullshit Cooking API Integration Tests
//
// Register and run all integration tests from this file.
// Avoid global seeds and fixtures, add data per test (per it).

export let server: Server | null = httpServer;
export let socketio: SocketIOServer | null = socketIOServer;

beforeAll(() => {
  console.log('Integration tests started.');
});

afterAll(async () => {
  userCronJob.stop();

  socketio?.removeAllListeners();
  socketio = null;
  
  server = null;

  await pool.end();

  redisClients.pubClient.disconnect();
  redisClients.subClient.disconnect();
  redisClients.sessionClient.disconnect();
  //redisClients.workerClient.disconnect();

  console.log('Integration tests finished.');
});

afterEach(async () => {
  socketio?.disconnectSockets(true);
  socketio?.close();

  await truncateTables();

  redisClients.pubClient.flushdb();
  redisClients.subClient.flushdb();
  redisClients.sessionClient.flushdb();
  //redisClients.workerClient.flushdb();
});

describe ('NOBSC API', () => {
  describe('GET /v1', () => {
    it('returns data correctly', async () => {
      const res = await request(server).get('/v1');
      expect(res.body).toEqual(`
        No Bullshit Cooking API
        Documentation at https://github.com/tjalferes/nobullshitcooking-api
      `);  // res.text ???
    });
  });

  //describe('AwsS3', AwsS3Tests);
  describe('cuisine', cuisineTests);
  describe('equipment', equipmentTests);
  describe('equipmentType', equipmentTypeTests);
  describe('ingredient', ingredientTests);
  describe('ingredientType', ingredientTypeTests);
  describe('method', methodTests);
  describe('recipe', recipeTests);
  describe('recipeType', recipeTypeTests);
  describe('search', searchTests);
  describe('unit', unitTests);

  describe('userAuth', userAuthTests);
  describe('userEquipment', userEquipmentTests);
  describe('userFavoriteRecipe', userFavoriteRecipeTests);
  //describe('userFriendship', userFriendshipTests);
  describe('userIngredient', userIngredientTests);
  describe('userPlan', userPlanTests);
  describe('userRecipe', userRecipeTests);
  describe('userSavedRecipe', userSavedRecipeTests);
  describe('user', userTests);
});

async function truncateTables() {
  // Ensure this touches ONLY test DBs, NEVER prod DBs!!!
  // To that end, we use a separate pool here (instead of src/connections/mysql.ts).
  const pool = createPool(testConfig);

  try {
    const tableNames = [
      'staff',
      'user',
      'image',
      'user_image',
      'friendship',
      'chatgroup',
      'chatroom',
      'chatmessage',
      'chatgroup_user',
      'chatroom_user',
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

    console.log('Reset test MySQL DB tables begin.');

    for (const tableName of tableNames) {
      await pool.execute(`TRUNCATE TABLE ${tableName}`);
    }

    await seedDatabase();  // TO DO: use a test specific seeder

    console.log('Reset test MySQL DB tables success.');
  } catch (error) {
    console.error('Reset test MySQL DB tables error:', error);
  } finally {
    await pool.end();
  }
}
