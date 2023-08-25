import { Router } from 'express';
import { body }   from 'express-validator';

import { userSavedRecipeController as controller } from './controller';
import { catchExceptions, userIsAuth } from '../../../../utils';

const router = Router();

// for /user/private/saved-recipe/...

export function userSavedRecipeRouter() {
  router.post(
    '/all',
    userIsAuth,
    catchExceptions(controller.viewByUserId)
  );

  router.post(
    '/create',
    userIsAuth,
    body('recipe_id').not().isEmpty().trim().escape(),
    catchExceptions(controller.create)
  );

  router.delete(
    '/delete',
    userIsAuth,
    body('recipe_id').not().isEmpty().trim().escape(),
    catchExceptions(controller.delete)
  );

  return router;
}
