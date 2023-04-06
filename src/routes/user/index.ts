import { Router } from 'express';
import { Pool }   from 'mysql2/promise';

import { userPrivateRouter }        from './private';
import { userAuthRouter }           from './auth';
import { userDataInitRouter  }      from './dataInit';
import { userFavoriteRecipeRouter } from './favoriteRecipe';
import { userFriendshipRouter }     from './friendship';
import { userPublicPlanRouter }     from './plan';
//import { userProfileRouter }        from './profile';
import { userPublicRecipeRouter }   from './recipe';
import { userSignedUrlRouter }      from './signed-url';

const router = Router();

// for /user/...

export function userRouter(pool: Pool) {
  router.use('/private',         userPrivateRouter(pool));

  router.use('/auth',            userAuthRouter(pool));
  router.use('/data-init',       userDataInitRouter(pool));
  router.use('/favorite-recipe', userFavoriteRecipeRouter(pool));
  router.use('/friendship',      userFriendshipRouter(pool));
  router.use('/plan',            userPublicPlanRouter(pool));
  //router.use('/profile',         userProfileRouter(pool));
  router.use('/recipe',          userPublicRecipeRouter(pool));
  router.use('/signed-url',      userSignedUrlRouter());  // does not need pool
  
  return router;
}
