import { Router } from 'express';
import { param }  from 'express-validator';

import { IngredientController } from './controller';
import { catchExceptions }      from '../../utils';

const router = Router();

// for /ingredient/...

export function ingredientRouter() {
  const controller = new IngredientController();

  router.get('/', catchExceptions(controller.viewAll));

  router.get(
    '/:ingredient_id',
    [param('ingredient_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
}
