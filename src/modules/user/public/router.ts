import { Router } from 'express';

import { userFavoriteRecipeRouter } from './favorite-recipe/router';
import { userPublicPlanRouter }     from './plan/router';
import { userPublicRecipeRouter }   from './recipe/router';

const router = Router();

// for /user/public/...

export function userPublicRouter() {
  router.use('/favorite-recipe', userFavoriteRecipeRouter());
  router.use('/plan',            userPublicPlanRouter());
  router.use('/recipe',          userPublicRecipeRouter());
  
  return router;
}
