import { Router } from 'express';
import { body } from 'express-validator';

import { userFavoriteRecipeController } from '../../controllers/user/favoriteRecipe';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// for /user/favorite-recipe/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(userFavoriteRecipeController.viewByUserId)
);

router.post(
  '/create',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userFavoriteRecipeController.create)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userFavoriteRecipeController.delete)
);