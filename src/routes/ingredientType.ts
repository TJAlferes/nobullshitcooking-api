import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { IngredientTypeController } from '../controllers/ingredientType';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /ingredient-type/...

export function ingredientTypeRouter(pool: Pool) {
  const controller = new IngredientTypeController(pool);

  router.get(
    '/',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/:name',
    [param('name').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewByName)
  );

  return router;
}