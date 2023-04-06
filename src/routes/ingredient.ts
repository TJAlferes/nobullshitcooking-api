import { Router } from 'express';
import { param }  from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { IngredientController } from '../controllers';
import { catchExceptions }      from '../lib/utils';

const router = Router();

// for /ingredient/...

export function ingredientRouter(pool: Pool) {
  const controller = new IngredientController(pool);

  router.get('/', catchExceptions(controller.viewAll));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
