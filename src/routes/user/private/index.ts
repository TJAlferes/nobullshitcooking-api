import { Router } from 'express';

//import { userDataInitRouter  }     from './dataInit';
import { userEquipmentRouter }     from './equipment';
import { userIngredientRouter }    from './ingredient';
import { userPrivatePlanRouter }   from './plan';
import { userPrivateRecipeRouter } from './recipe';
import { userSavedRecipeRouter }   from './savedRecipe';

const router = Router();

// for /user/private/...

export function userPrivateRouter() {
  //router.use('/data-init',    userDataInitRouter());
  router.use('/equipment',    userEquipmentRouter());
  router.use('/ingredient',   userIngredientRouter());
  router.use('/plan',         userPrivatePlanRouter());
  router.use('/recipe',       userPrivateRecipeRouter());
  router.use('/saved-recipe', userSavedRecipeRouter());
  
  return router;
}
