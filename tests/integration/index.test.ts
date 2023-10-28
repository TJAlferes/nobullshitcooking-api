import { createPool } from 'mysql2/promise';
import type { Server } from 'node:http';
import request from 'supertest';

import { pool, testConfig } from '../../src/connections/mysql.js';
import { redisClients } from '../../src/connections/redis.js';
import { httpServer, userCronJob } from '../../src/index.js';
import {
  userAuthTests,
  userEquipmentTests,
  userFavoriteRecipeTests,
  //userFriendshipTests,
  userIngredientTests,
  userPlanTests,
  userRecipeTests,
  userSavedRecipeTests
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

// Register and run all integration tests from this file
// Avoid global seeds and fixtures, add data per test (per it)

export let server: Server | null = httpServer;

beforeAll(() => {
  console.log('Integration tests started.');
});

afterAll(async () => {
  server = null;
  userCronJob.stop();

  await pool.end();

  redisClients.pubClient.disconnect();
  redisClients.subClient.disconnect();
  redisClients.sessionClient.disconnect();
  //redisClients.workerClient.disconnect();

  console.log('Integration tests finished.');
});

afterEach(async () => {
  await truncateTables();
});

describe ('NOBSC API', () => {
  describe('GET /', () => {
    it('returns data correctly', async () => {
      const { text } = await request(server).get('/');
      expect(text).toEqual(`
        No Bullshit Cooking API
        Documentation at https://github.com/tjalferes/nobullshitcooking-api
      `);
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
});

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs
async function truncateTables() {
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

    for (const tableName of tableNames) {
      await pool.execute(`TRUNCATE TABLE ${tableName}`);
    }

    console.log('Truncate test MySQL DB tables success.');
  } catch (error) {
    console.error('Truncate test MySQL DB tables error:', error);
  } finally {
    await pool.end();
  }
}
