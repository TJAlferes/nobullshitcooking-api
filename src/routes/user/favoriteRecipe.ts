import { Router } from 'express';
import { body } from 'express-validator';

import { userFavoriteRecipeController } from '../../controllers/user/favoriteRecipe';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// /v1/... ?

// for /user/favorite-recipe/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(userFavoriteRecipeController.viewMyFavoriteRecipes)
);

router.post(
  '/create',
  userIsAuth,
  [body('recipeId').not().isEmpty().trim().escape()],
  catchExceptions(userFavoriteRecipeController.createMyFavoriteRecipe)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('recipeId').not().isEmpty().trim().escape()],
  catchExceptions(userFavoriteRecipeController.deleteMyFavoriteRecipe)
);