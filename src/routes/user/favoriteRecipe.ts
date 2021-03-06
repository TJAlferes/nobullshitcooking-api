import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import {
  UserFavoriteRecipeController
} from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/favorite-recipe/...

export function userFavoriteRecipeRouter(pool: Pool) {
  const controller = new UserFavoriteRecipeController(pool);

  router.post(
    '/',
    userIsAuth,
    catchExceptions(controller.viewByUserId)
  );

  router.post(
    '/create',
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.create)
  );

  router.delete(
    '/delete',
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.delete)
  );

  return router;
}