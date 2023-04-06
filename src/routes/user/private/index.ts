import { Router } from 'express';
import { Pool }   from 'mysql2/promise';

//import { userDataInitRouter  }     from './dataInit';
import { userEquipmentRouter }     from './equipment';
import { userIngredientRouter }    from './ingredient';
import { userPrivatePlanRouter }   from './plan';
import { userPrivateRecipeRouter } from './recipe';
import { userSavedRecipeRouter }   from './savedRecipe';

const router = Router();

// for /user/private/...

export function userPrivateRouter(pool: Pool) {
  //router.use('/data-init',    userDataInitRouter(pool));
  router.use('/equipment',    userEquipmentRouter(pool));
  router.use('/ingredient',   userIngredientRouter(pool));
  router.use('/plan',         userPrivatePlanRouter(pool));
  router.use('/recipe',       userPrivateRecipeRouter(pool));
  router.use('/saved-recipe', userSavedRecipeRouter(pool));
  
  return router;
}
