import { Router } from 'express';

import { recipeController } from '../controllers/recipe';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// /v1/... ?

// for /recipe/...

router.get(
  '/official/all',
  catchExceptions(recipeController.viewRecipes)
);

router.get(
  '/:recipeId',
  catchExceptions(recipeController.viewRecipeDetail)
);