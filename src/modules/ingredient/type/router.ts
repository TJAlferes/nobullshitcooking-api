import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../../utils';
import { ingredientTypeController } from './controller';

const router = Router();

// for /ingredient-types

export function ingredientTypeRouter() {
  router.get(
    '/:ingredient_type_id',
    [param('ingredient_type_id').trim().notEmpty()],
    catchExceptions(ingredientTypeController.viewOne)
  );

  router.get('/', catchExceptions(ingredientTypeController.viewAll));

  return router;
}
