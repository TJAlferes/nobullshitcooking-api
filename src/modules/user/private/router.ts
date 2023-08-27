import { Router } from 'express';

import { userDataInitRouter }      from './data-init/router';
import { privateEquipmentRouter }  from './equipment/router';
import { privateIngredientRouter } from './ingredient/router';
import { privatePlanRouter }       from './plan/router';
import { privateRecipeRouter }     from './recipe/router';
import { userSavedRecipeRouter }   from './saved-recipe/router';

const router = Router();

// for /user/private/...

export function userPrivateRouter() {
  router.use('/data-init',    userDataInitRouter());
  router.use('/equipment',    privateEquipmentRouter());
  router.use('/ingredient',   privateIngredientRouter());
  router.use('/plan',         privatePlanRouter());
  router.use('/recipe',       privateRecipeRouter());
  router.use('/saved-recipe', userSavedRecipeRouter());
  
  return router;
}
