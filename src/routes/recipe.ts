import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { RecipeController } from '../controllers/recipe';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /recipe/...

export function recipeRouter(pool: Pool) {
  const controller = new RecipeController(pool);

  router.get(
    '/official/all',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/:id',
    catchExceptions(controller.viewById)
  );

  return router;
}