import { Router } from 'express';
import { body }   from 'express-validator';

import { UserFavoriteRecipeController } from '../../controllers/user';
import { catchExceptions, userIsAuth }  from '../../lib/utils';

const router = Router();

// for /user/favorite-recipe/...

export function userFavoriteRecipeRouter() {
  const controller = new UserFavoriteRecipeController();

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
