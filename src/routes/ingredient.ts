import { Router } from 'express';
import { param }  from 'express-validator';

import { IngredientController } from '../controllers';
import { catchExceptions }      from '../lib/utils';

const router = Router();

// for /ingredient/...

export function ingredientRouter() {
  const controller = new IngredientController();

  router.get('/', catchExceptions(controller.viewAll));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
