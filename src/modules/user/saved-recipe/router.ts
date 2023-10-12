import { Router } from 'express';
import { param }  from 'express-validator';

import { userSavedRecipeController as controller } from './controller';
import { catchExceptions, userIsAuth } from '../../../utils';

const router = Router();

// for /users/:user_id/saved-recipes

export function savedRecipeRouter() {
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
