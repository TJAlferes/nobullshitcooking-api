'use strict';

import { Application } from 'express';
import { Pool } from 'mysql2/promise';
import { Client } from '@elastic/elasticsearch';

import {
  staffRouter,
  userRouter,
  contentRouter,
  contentTypeRouter,
  cuisineRouter,
  dataInitRouter,
  equipmentRouter,
  equipmentTypeRouter,
  favoriteRecipeRouter,
  ingredientRouter,
  ingredientTypeRouter,
  measurementRouter,
  methodRouter,
  profileRouter,
  recipeRouter,
  recipeTypeRouter,
  searchRouter,
  supplierRouter
} from '../../routes';

export function routesInit(app: Application, pool: Pool, esClient: Client) {
  const staffRoutes = staffRouter(esClient, pool);
  const userRoutes = userRouter(esClient, pool);
  const contentRoutes = contentRouter(pool);
  const contentTypeRoutes = contentTypeRouter(pool);
  const cuisineRoutes = cuisineRouter(pool);
  const dataInitRoutes = dataInitRouter(pool);
  const equipmentRoutes = equipmentRouter(pool);
  const equipmentTypeRoutes = equipmentTypeRouter(pool);
  const favoriteRecipeRoutes = favoriteRecipeRouter(pool);
  const ingredientRoutes = ingredientRouter(pool);
  const ingredientTypeRoutes = ingredientTypeRouter(pool);
  const measurementRoutes = measurementRouter(pool);
  const methodRoutes = methodRouter(pool);
  const profileRoutes = profileRouter(pool);
  const recipeRoutes = recipeRouter(pool);
  const recipeTypeRoutes = recipeTypeRouter(pool);
  const searchRoutes = searchRouter(esClient);
  const supplierRoutes = supplierRouter(pool);
  
  app.get('/', (req, res) => {
    res.send(`
      No Bullshit Cooking Backend API.
      Documentation at https://github.com/tjalferes/nobullshitcooking-api
    `);
  });
  app.use('/staff', staffRoutes);
  app.use('/user', userRoutes);
  app.use('/content', contentRoutes);
  app.use('/content-type', contentTypeRoutes);
  app.use('/cuisine', cuisineRoutes);
  app.use('/data-init', dataInitRoutes);
  app.use('/equipment', equipmentRoutes);
  app.use('/equipment-type', equipmentTypeRoutes);
  app.use('/favorite-recipe', favoriteRecipeRoutes);
  app.use('/ingredient', ingredientRoutes);
  app.use('/ingredient-type', ingredientTypeRoutes);
  app.use('/measurement', measurementRoutes);
  app.use('/method', methodRoutes);
  app.use('/profile', profileRoutes);
  app.use('/recipe', recipeRoutes);
  app.use('/recipe-type', recipeTypeRoutes);
  app.use('/search', searchRoutes);
  app.use('/supplier', supplierRoutes);
}