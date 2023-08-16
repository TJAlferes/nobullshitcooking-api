import { Router } from 'express';
import { param }  from 'express-validator';

import { IngredientTypeController } from './controller';
import { catchExceptions }          from '../../../utils';

const router = Router();

// for /ingredient-type/...

export function ingredientTypeRouter() {
  const controller = new IngredientTypeController();

  router.get('/', catchExceptions(controller.viewAll));

  router.get(
    '/:ingredient_type_id',
    [param('ingredient_type_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
}
