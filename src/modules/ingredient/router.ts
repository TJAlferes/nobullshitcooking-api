import { Router } from 'express';
import { param }  from 'express-validator';

import { catchExceptions }      from '../../utils';
import { ingredientController } from './controller';

const router = Router();

// for /ingredients/...

export function ingredientRouter() {
  router.get('/', catchExceptions(ingredientController.viewAll));

  router.get(
    '/:ingredient_id',
    [param('ingredient_id').not().isEmpty().trim().escape()],
    catchExceptions(ingredientController.viewOne)
  );

  return router;
}
