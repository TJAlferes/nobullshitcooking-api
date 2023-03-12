'use strict';

import { Application } from 'express';
import { Pool } from 'mysql2/promise';

import { staffRouter } from          './staff/index';
import { userRouter } from           './user/index';
import { cuisineRouter } from        './cuisine';
import { dataInitRouter } from       './dataInit';
import { equipmentRouter } from      './equipment';
import { equipmentTypeRouter } from  './equipmentType';
import { favoriteRecipeRouter } from './favoriteRecipe';
import { ingredientRouter } from     './ingredient';
import { ingredientTypeRouter } from './ingredientType';
import { measurementRouter } from    './measurement';
import { methodRouter } from         './method';
import { profileRouter } from        './profile';
import { recipeRouter } from         './recipe';
import { recipeTypeRouter } from     './recipeType';
import { searchRouter } from         './search';
import { supplierRouter } from       './supplier';

// TO DO: add grocer
export function routesInit(app: Application, pool: Pool) {
  app.get('/', (req, res) => res.send(`No Bullshit Cooking Backend API. Documentation at https://github.com/tjalferes/nobullshitcooking-api`));
  
  app.use('/staff',           staffRouter(pool));
  app.use('/user',            userRouter(pool));
  app.use('/cuisine',         cuisineRouter(pool));
  app.use('/data-init',       dataInitRouter(pool));
  app.use('/equipment',       equipmentRouter(pool));
  app.use('/equipment-type',  equipmentTypeRouter(pool));
  app.use('/favorite-recipe', favoriteRecipeRouter(pool));
  app.use('/ingredient',      ingredientRouter(pool));
  app.use('/ingredient-type', ingredientTypeRouter(pool));
  app.use('/measurement',     measurementRouter(pool));
  app.use('/method',          methodRouter(pool));
  app.use('/profile',         profileRouter(pool));
  app.use('/recipe',          recipeRouter(pool));
  app.use('/recipe-type',     recipeTypeRouter(pool));
  app.use('/search',          searchRouter(pool));
  app.use('/supplier',        supplierRouter(pool));
}
