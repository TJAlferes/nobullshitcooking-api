import { Router } from 'express';
import { body }   from 'express-validator';

import { UserSavedRecipeController }   from '../../../controllers/user/private';
import { catchExceptions, userIsAuth } from '../../../lib/utils';

const router = Router();

// for /user/private/saved-recipe/...

export function userSavedRecipeRouter() {
  const controller = new UserSavedRecipeController();

  router.post(
    '/all',
    userIsAuth,
    catchExceptions(controller.viewByUserId)
  );

  router.post(
    '/create',
    userIsAuth,
    body('id').not().isEmpty().trim().escape(),
    catchExceptions(controller.create)
  );

  router.delete(
    '/delete',
    userIsAuth,
    body('id').not().isEmpty().trim().escape(),
    catchExceptions(controller.delete)
  );

  return router;
}
