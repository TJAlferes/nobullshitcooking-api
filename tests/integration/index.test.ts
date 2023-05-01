import request from 'supertest';

import { pool }         from '../../src/lib/connections/mysql';
import { redisClients } from '../../src/lib/connections/redis';
import { appServer }    from '../../src/app';
import {
  userAuthTests,
  userEquipmentTests,
  userFavoriteRecipeTests,
  userFriendshipTests,
  userGetSignedUrlTests,
  userIngredientTests,
  userPlanTests,
  userRecipeTests,
  userSavedRecipeTests
} from './user/index';
import {
  cuisineTests,
  dataInitTests,
  equipmentTests,
  equipmentTypeTests,
  favoriteRecipeTests,
  ingredientTests,
  ingredientTypeTests,
  measurementTests,
  methodTests,
  profileTests,
  recipeTests,
  recipeTypeTests,
  searchTests
} from './index';

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs

// Avoid global seeds and fixtures, add data per test (per it)

export let server: any = appServer(pool, redisClients);

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
      expect(text).toEqual(`No Bullshit Cooking Backend API. Documentation at https://github.com/tjalferes/nobullshitcooking-api`);
    });
  });
  describe('cuisine', cuisineTests);
  describe('dataInit', dataInitTests);
  describe('equipment', equipmentTests);
  describe('equipmentType', equipmentTypeTests);
  describe('favoriteRecipe', favoriteRecipeTests);
  describe('ingredient', ingredientTests);
  describe('ingredientType', ingredientTypeTests);
  describe('measurement', measurementTests);
  describe('method', methodTests);
  describe('profile', profileTests);
  describe('recipe', recipeTests);
  describe('recipeType', recipeTypeTests);
  describe('search', searchTests);

  describe('userAuth', userAuthTests);
  describe('userEquipment', userEquipmentTests);
  describe('userFavoriteRecipe', userFavoriteRecipeTests);
  describe('userFriendship', userFriendshipTests);
  describe('userGetSignedUrl', userGetSignedUrlTests);
  describe('userIngredient', userIngredientTests);
  describe('userPlan', userPlanTests);
  describe('userRecipe', userRecipeTests);
  describe('userSavedRecipe', userSavedRecipeTests);
});
