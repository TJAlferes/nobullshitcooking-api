import { Router } from 'express';
import { param }  from 'express-validator';

import { IngredientTypeController } from '../controllers';
import { catchExceptions }          from '../lib/utils';

const router = Router();

// for /ingredient-type/...

export function ingredientTypeRouter() {
  const controller = new IngredientTypeController();

  router.get('/', catchExceptions(controller.viewAll));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
