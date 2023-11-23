import { createPool } from 'mysql2/promise';
import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { seedTestDatabase } from '../../seeds/test';
import { testConfig, pool } from '../../src/connections/mysql';
import { redisClients } from '../../src/connections/redis';
import { app, httpServer, socketIOServer } from '../../src/app';

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
} from './user';
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
} from '.';

// No Bullshit Cooking API Integration Tests
//
// Register and run all integration tests from this file.
// Avoid global seeds and fixtures, add data per test (per it).

beforeAll(async () => {
  await seedTestDatabase();
});

describe('NOBSC API integration tests (read tests)', () => {
  describe('GET /v1', () => {
    it('works', async () => {
      const res = await request(app).get('/v1');
      expect(res.text).toBe('No Bullshit Cooking API\nDocumentation at https://github.com/tjalferes/nobullshitcooking-api');
    });
  });
  //describe('units', () => unitsTests(app));
  //describe('equipmentTypes', () => equipmentTypesTests(app));
  //describe('ingredientTypes', () => ingredientTypesTests(app));
  //describe('recipeTypes', () => recipeTypesTests(app));
  //describe('methods', () => methodsTests(app));
  //describe('cuisines', () => cuisinesTests(app));
  //describe('equipment', () => equipmentTests(app));
  //describe('ingredients', () => ingredientsTests(app));
  //describe('recipes', () => recipesTests(app));
  //describe('search', () => searchTests(app));
});

describe('NOBSC API integration tests (write tests)', () => {
  beforeEach(async () => {
    await truncateTestDatabase();
    await seedTestDatabase();
  });
  //describe('authentication', () => authenticationTests(app));
  //describe('users', () => usersTests(app));
  //describe('profile', () => profileTests(app));
  //describe('friendships', () => friendshipsTests(app));

  //describe('publicPlans', () => publicPlansTests(app));
  //describe('publicRecipes', () => publicRecipesTests(app));
  describe('favoriteRecipes', () => favoriteRecipesTests(app));
  describe('privateEquipment', () => privateEquipmentTests(app));
  describe('privateIngredients', () => privateIngredientsTests(app));
  //describe('privatePlans', () => privatePlansTests(app));
  //describe('privateRecipes', () => privateRecipesTests(app));
  describe('savedRecipe', () => savedRecipesTests(app));
  //describe('AwsS3', AwsS3Tests(app));
});

afterEach(async () => {
  await redisClients.pubClient.flushall();
  await redisClients.sessionClient.flushall();
  socketIOServer?.disconnectSockets(false);
});

afterAll(async () => {
  redisClients.pubClient.disconnect();
  redisClients.subClient.disconnect();
  redisClients.sessionClient.disconnect();
  await pool.end();
  //socketIOServer?.close(err => console.log(err));
  //httpServer?.close(err => console.log(err));
});

const tableNames = [
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
  // To that end, we use a separate pool here (instead of src/connections/mysql.ts)
  // and directly pass in the testConfig.
  const pool = createPool(testConfig);
  try {
    //console.log('Truncate test MySQL DB tables begin.');
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
      } finally {
        conn.release();
      }
    }
    //console.log('Truncate test MySQL DB tables success.');
  } catch (error) {
    console.error('Truncate test MySQL DB tables error:', error);
  } finally {
    await pool.end();
  }
}
