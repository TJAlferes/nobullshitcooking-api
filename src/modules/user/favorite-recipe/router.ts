import { Router } from 'express';
import { body }   from 'express-validator';

import { userFavoriteRecipeController as controller } from './controller';
import { catchExceptions, userIsAuth } from '../../../utils';

const router = Router();

// for /users/:username/favorite-recipes

export function userFavoriteRecipeRouter() {
  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewByUserId)
  );

  router.post(
    '/',
    userIsAuth,
    body('recipe_id').not().isEmpty().trim().escape(),
    catchExceptions(controller.create)
  );

  router.delete(
    '/',
    userIsAuth,
    body('recipe_id').not().isEmpty().trim().escape(),
    catchExceptions(controller.delete)
  );

  return router;
}
