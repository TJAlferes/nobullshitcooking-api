import request from 'supertest';
import type { Server } from 'node:http';

import { pool } from '../../src/connections/mysql.js';
import { redisClients } from '../../src/connections/redis.js';
import { httpServer } from '../../src/index.js';
import {
  userAuthTests,
  userEquipmentTests,
  userFavoriteRecipeTests,
  //userFriendshipTests,
  userGetSignedUrlTests,
  userIngredientTests,
  userPlanTests,
  userRecipeTests,
  userSavedRecipeTests
} from './user/index.js';
import {
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

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs
// Avoid global seeds and fixtures, add data per test (per it)

export let server: Server | null = httpServer;

beforeAll(() => {
  // TO DO: clean the test db
  console.log('Integration tests started.');
});

afterAll(() => {
  const { pubClient, subClient, sessionClient } = redisClients;
  server = null;
  pool.end();
  pubClient.disconnect();
  subClient.disconnect();
  sessionClient.disconnect();
  //workerClient.disconnect();
  console.log('Integration tests finished.');
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
  describe('userGetSignedUrl', userGetSignedUrlTests);
  describe('userIngredient', userIngredientTests);
  describe('userPlan', userPlanTests);
  describe('userRecipe', userRecipeTests);
  describe('userSavedRecipe', userSavedRecipeTests);
});
