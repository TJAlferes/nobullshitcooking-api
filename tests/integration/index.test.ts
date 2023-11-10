import { createPool } from 'mysql2/promise';
import type { Server } from 'node:http';
import type { Server as SocketIOServer } from 'socket.io';
import request from 'supertest';

import { seedTestDatabase } from '../../seeds/test/index.js';
import { pool, testConfig } from '../../src/connections/mysql.js';
import { redisClients } from '../../src/connections/redis.js';
import { httpServer, socketIOServer, userCronJob, passwordResetCronJob } from '../../src/index.js';
import {
  authenticationTests,
  usersTests,
  profileTests,
  friendshipsTests,
  publicPlansTests,
  publicRecipesTests,
  favoriteRecipesTests,
  privateEquipmentTests,
  privateIngredientsTests,
  privatePlansTests,
  privateRecipesTests,
  savedRecipesTests
} from './user/index.js';
import {
  //AwsS3Tests,
  unitsTests,
  equipmentTypesTests,
  ingredientTypesTests,
  recipeTypesTests,
  methodsTests,
  cuisinesTests,
  equipmentTests,
  ingredientsTests,
  recipesTests,
  searchTests
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
  passwordResetCronJob.stop();

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

  await truncateTestDatabase();

  redisClients.pubClient.flushdb();
  redisClients.subClient.flushdb();
  redisClients.sessionClient.flushdb();
  //redisClients.workerClient.flushdb();
});

describe ('NOBSC API', () => {
  describe('GET /v1', () => {
    it('works', async () => {
      const res = await request(server).get('/v1');
      expect(res.body).toEqual(`
        No Bullshit Cooking API
        Documentation at https://github.com/tjalferes/nobullshitcooking-api
      `);  // res.text ???
    });
  });
  //describe('AwsS3', AwsS3Tests);
  describe('units', unitsTests);
  describe('equipmentTypes', equipmentTypesTests);
  describe('ingredientTypes', ingredientTypesTests);
  describe('recipeTypes', recipeTypesTests);
  describe('methods', methodsTests);
  describe('cuisines', cuisinesTests);
  describe('equipment', equipmentTests);
  describe('ingredients', ingredientsTests);
  describe('recipes', recipesTests);
  describe('search', searchTests);
  describe('authentication', authenticationTests);
  describe('users', usersTests);
  describe('profile', profileTests);
  describe('friendships', friendshipsTests);
  describe('publicPlans', publicPlansTests);
  describe('publicRecipes', publicRecipesTests);
  describe('favoriteRecipes', favoriteRecipesTests);
  describe('privateEquipment', privateEquipmentTests);
  describe('privateIngredients', privateIngredientsTests);
  describe('privatePlans', privatePlansTests);
  describe('privateRecipes', privateRecipesTests);
  describe('savedRecipe', savedRecipesTests);
});

async function truncateTestDatabase() {
  // Ensure this touches ONLY test DBs, NEVER prod DBs!!!
  // To that end, we use a separate pool here (instead of src/connections/mysql.ts).
  const pool = createPool(testConfig);

  try {
    const tableNames = [
      'user',
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
    ];

    console.log('Reset test MySQL DB tables begin.');

    for (const tableName of tableNames) {
      await pool.execute(`TRUNCATE TABLE ${tableName}`);
    }

    await seedTestDatabase();

    console.log('Reset test MySQL DB tables success.');
  } catch (error) {
    console.error('Reset test MySQL DB tables error:', error);
  } finally {
    await pool.end();
  }
}
