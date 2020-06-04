import { Router } from 'express';

import { favoriteRecipeController } from '../controllers/favoriteRecipe';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// /v1/... ?

// for /favorite-recipe/...

router.get(
  '/',
  catchExceptions(favoriteRecipeController.viewMostFavorited)
);