import { Router } from 'express';
import { param }   from 'express-validator';

import { userFavoriteRecipeController as controller } from './controller.js';
import { catchExceptions, userIsAuth } from '../../../utils/index.js';

const router = Router();

// for /users/:username/favorite-recipes

export function favoriteRecipeRouter() {
  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewByUserId)
  );

  router.post(
    '/:recipe_id',
    userIsAuth,
    sanitizeParams('recipe_id'),
    catchExceptions(controller.create)
  );

  router.delete(
    '/:recipe_id',
    userIsAuth,
    sanitizeParams('recipe_id'),
    catchExceptions(controller.delete)
  );

  return router;
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).not().isEmpty().trim().escape();
}
