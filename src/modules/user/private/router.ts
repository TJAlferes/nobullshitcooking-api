import { Router } from 'express';

import { userDataInitRouter }      from './data-init/router';
import { userEquipmentRouter }     from './equipment/router';
import { userIngredientRouter }    from './ingredient/router';
import { userPrivatePlanRouter }   from './plan/router';
import { userPrivateRecipeRouter } from './recipe/router';
import { userSavedRecipeRouter }   from './saved-recipe/router';

const router = Router();

// for /user/private/...

export function userPrivateRouter() {
  router.use('/data-init',    userDataInitRouter());
  router.use('/equipment',    userEquipmentRouter());
  router.use('/ingredient',   userIngredientRouter());
  router.use('/plan',         userPrivatePlanRouter());
  router.use('/recipe',       userPrivateRecipeRouter());
  router.use('/saved-recipe', userSavedRecipeRouter());
  
  return router;
}
