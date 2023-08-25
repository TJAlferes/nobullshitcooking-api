import { Router } from 'express';
import { param }  from 'express-validator';

import { ingredientTypeController } from './controller';
import { catchExceptions }          from '../../../utils';

const router = Router();

// for /ingredient-type/...

export function ingredientTypeRouter() {
  router.get('/', catchExceptions(ingredientTypeController.viewAll));

  router.get(
    '/:ingredient_type_id',
    [param('ingredient_type_id').not().isEmpty().trim().escape()],
    catchExceptions(ingredientTypeController.viewOne)
  );

  return router;
}
