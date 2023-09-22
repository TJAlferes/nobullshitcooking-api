import { Router } from 'express';
import { body }   from 'express-validator';

import { userSavedRecipeController as controller } from './controller';
import { catchExceptions, userIsAuth } from '../../../utils';

const router = Router();

// for /users/:user_id/saved-recipes

export function userSavedRecipeRouter() {
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
