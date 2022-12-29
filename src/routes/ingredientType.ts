import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { IngredientTypeController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /ingredient-type/...

export function ingredientTypeRouter(pool: Pool) {
  const controller = new IngredientTypeController(pool);

  router.get('/', catchExceptions(controller.view));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewById));

  return router;
}