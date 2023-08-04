import { Router } from 'express';

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

export function userRouter() {
  router.use('/private',         userPrivateRouter());

  router.use('/auth',            userAuthRouter());
  router.use('/data-init',       userDataInitRouter());
  router.use('/favorite-recipe', userFavoriteRecipeRouter());
  router.use('/friendship',      userFriendshipRouter());
  router.use('/plan',            userPublicPlanRouter());
  //router.use('/profile',         userProfileRouter());
  router.use('/recipe',          userPublicRecipeRouter());
  router.use('/signed-url',      userSignedUrlRouter());
  
  return router;
}
