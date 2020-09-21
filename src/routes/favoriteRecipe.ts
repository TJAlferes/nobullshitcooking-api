import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { FavoriteRecipeController } from '../controllers/favoriteRecipe';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /favorite-recipe/...

export function favoriteRecipeRouter(pool: Pool) {
  const controller = new FavoriteRecipeController(pool);

  router.get(
    '/',
    catchExceptions(controller.viewMostFavorited)
  );

  return router;
}