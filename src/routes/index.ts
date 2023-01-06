'use strict';

import { Application } from 'express';
import { Pool } from 'mysql2/promise';
import { Client } from '@elastic/elasticsearch';

import { staffRouter } from './staff/index';
import { userRouter } from './user/index';
import { cuisineRouter } from './cuisine';
import { dataInitRouter } from './dataInit';
import { equipmentRouter } from './equipment';
import { equipmentTypeRouter } from './equipmentType';
import { favoriteRecipeRouter } from './favoriteRecipe';
import { ingredientRouter } from './ingredient';
import { ingredientTypeRouter } from './ingredientType';
import { measurementRouter } from './measurement';
import { methodRouter } from './method';
import { profileRouter } from './profile';
import { recipeRouter } from './recipe';
import { recipeTypeRouter } from './recipeType';
import { searchRouter } from './search';
import { supplierRouter } from './supplier';

// TO DO: add grocer
export function routesInit(app: Application, pool: Pool, esClient: Client) {
  const staff =          staffRouter(esClient, pool);
  const user =           userRouter(esClient, pool);
  const cuisine =        cuisineRouter(pool);
  const dataInit =       dataInitRouter(pool);
  const equipment =      equipmentRouter(pool);
  const equipmentType =  equipmentTypeRouter(pool);
  const favoriteRecipe = favoriteRecipeRouter(pool);
  const ingredient =     ingredientRouter(pool);
  const ingredientType = ingredientTypeRouter(pool);
  const measurement =    measurementRouter(pool);
  const method =         methodRouter(pool);
  const profile =        profileRouter(pool);
  const recipe =         recipeRouter(pool);
  const recipeType =     recipeTypeRouter(pool);
  const search =         searchRouter(esClient);
  const supplier =       supplierRouter(pool);
  
  app.get('/', (req, res) => res.send(`No Bullshit Cooking Backend API. Documentation at https://github.com/tjalferes/nobullshitcooking-api`));

  app.use('/staff',           staff);
  app.use('/user',            user);
  app.use('/cuisine',         cuisine);
  app.use('/data-init',       dataInit);
  app.use('/equipment',       equipment);
  app.use('/equipment-type',  equipmentType);
  app.use('/favorite-recipe', favoriteRecipe);
  app.use('/ingredient',      ingredient);
  app.use('/ingredient-type', ingredientType);
  app.use('/measurement',     measurement);
  app.use('/method',          method);
  app.use('/profile',         profile);
  app.use('/recipe',          recipe);
  app.use('/recipe-type',     recipeType);
  app.use('/search',          search);
  app.use('/supplier',        supplier);
}