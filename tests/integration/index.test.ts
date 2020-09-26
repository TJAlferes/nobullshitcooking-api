import request from 'supertest';

import { esClient } from '../../src/lib/connections/elasticsearchClient';
import { pool } from '../../src/lib/connections/mysqlPoolConnection';
import { appServer } from '../../src/app';
import {
  staffAuthTests,
  staffContentTests,
  staffCuisineEquipmentTests,
  staffCuisineIngredientTests,
  staffCuisineSupplierTests,
  staffEquipmentTests,
  staffGetSignedUrlTests,
  staffIngredientTests,
  staffRecipeTests,
  staffSupplierTests
} from './staff/index';
import {
  userAuthTests,
  userContentTests,
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
  contentTests,
  contentTypeTests,
  cuisineTests,
  cuisineEquipmentTests,
  cuisineIngredientTests,
  cuisineSupplierTests,
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
  searchTests,
  supplierTests
} from './index';

// Make sure this only touches test DBs
// Make sure this never touches dev DBs
// Make sure this NEVER touches prod DBs

// Avoid global seeds and fixtures, add data per test (per it)

export let server: any = appServer(pool, esClient);;

beforeAll(() => {
  // TO DO: clean the test db
});

afterAll(() => {
  // TO DO NOW: disconnect dbs: mysql, redis, elasticsearch
  server = null;
});

describe ('NOBSC API', () => {
  describe('GET /', () => {
    it('returns data correctly', async () => {
      const { text } = await request(server).get('/');
      expect(text).toEqual(`
        No Bullshit Cooking Backend API.
        Documentation at https://github.com/tjalferes/nobullshitcooking-api
      `);
    });
  });
  describe('content', contentTests);
  describe('contentType', contentTypeTests);
  describe('cuisine', cuisineTests);
  describe('cuisineEquipment', cuisineEquipmentTests);
  describe('cuisineIngredient', cuisineIngredientTests);
  describe('cuisineSupplier', cuisineSupplierTests);
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
  describe('supplier', supplierTests);
  describe('staffAuth', staffAuthTests);
  describe('staffContent', staffContentTests);
  describe('staffEquipment', staffCuisineEquipmentTests);
  describe('staffIngredient', staffCuisineIngredientTests);
  describe('staffSupplier', staffCuisineSupplierTests);
  describe('staffEquipment', staffEquipmentTests);
  describe('staffGetSignedUrl', staffGetSignedUrlTests);
  describe('staffIngredient', staffIngredientTests);
  describe('staffRecipe', staffRecipeTests);
  describe('staffSupplier', staffSupplierTests);
  describe('userAuth', userAuthTests);
  describe('userContent', userContentTests);
  describe('userEquipment', userEquipmentTests);
  describe('userFavoriteRecipe', userFavoriteRecipeTests);
  describe('userFriendship', userFriendshipTests);
  describe('userGetSignedUrl', userGetSignedUrlTests);
  describe('userIngredient', userIngredientTests);
  describe('userPlan', userPlanTests);
  describe('userRecipe', userRecipeTests);
  describe('userSavedRecipe', userSavedRecipeTests);
});