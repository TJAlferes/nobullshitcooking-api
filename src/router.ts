'use strict';

import { Application } from 'express';

import { userRouter }           from './user/index';
import { cuisineRouter }        from './cuisine';
import { dataInitRouter }       from './modules/data-init/router';
import { equipmentRouter }      from './equipment';
import { equipmentTypeRouter }  from './equipmentType';
import { ingredientRouter }     from './ingredient';
import { ingredientTypeRouter } from './ingredientType';
import { measurementRouter }    from './measurement';
import { methodRouter }         from './method';
import { profileRouter }        from './profile';
import { recipeRouter }         from './recipe';
import { recipeTypeRouter }     from './recipeType';
import { searchRouter }         from './search';

// TO DO: add grocer
export function routesInit(app: Application) {
  app.get('/', (req, res) => res.send(`
    No Bullshit Cooking Backend API.
    Documentation at https://github.com/tjalferes/nobullshitcooking-api
  `));
  
  app.use('/user',            userRouter());

  app.use('/cuisine',         cuisineRouter());
  app.use('/data-init',       dataInitRouter());
  app.use('/equipment',       equipmentRouter());
  app.use('/equipment-type',  equipmentTypeRouter());
  app.use('/ingredient',      ingredientRouter());
  app.use('/ingredient-type', ingredientTypeRouter());
  app.use('/measurement',     measurementRouter());
  app.use('/method',          methodRouter());
  app.use('/profile',         profileRouter());
  app.use('/recipe',          recipeRouter());
  app.use('/recipe-type',     recipeTypeRouter());
  app.use('/search',          searchRouter());
}
