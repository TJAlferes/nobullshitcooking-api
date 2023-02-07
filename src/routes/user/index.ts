import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { userAuthRouter }           from './auth';
import { userDataInitRouter  }      from './dataInit';
import { userEquipmentRouter }      from './equipment';
import { userFavoriteRecipeRouter } from './favoriteRecipe';
import { userFriendshipRouter }     from './friendship';
import { userIngredientRouter }     from './ingredient';
import { userPlanRouter }           from './plan';
//import { userProfileRouter }        from './profile';
import { userRecipeRouter }         from './recipe';
import { userSavedRecipeRouter }    from './savedRecipe';
import { userSignedUrlRouter }      from './signed-url';

const router = Router();

// for /user/...

export function userRouter(pool: Pool) {
  router.use('/auth',            userAuthRouter(pool));
  router.use('/data-init',       userDataInitRouter(pool));
  router.use('/equipment',       userEquipmentRouter(pool));
  router.use('/favorite-recipe', userFavoriteRecipeRouter(pool));
  router.use('/friendship',      userFriendshipRouter(pool));
  router.use('/ingredient',      userIngredientRouter(pool));
  router.use('/plan',            userPlanRouter(pool));
  //router.use('/profile',         userProfileRouter(pool));
  router.use('/recipe',          userRecipeRouter(pool));
  router.use('/saved-recipe',    userSavedRecipeRouter(pool));
  router.use('/signed-url',      userSignedUrlRouter());  // does not need pool
  
  return router;
}