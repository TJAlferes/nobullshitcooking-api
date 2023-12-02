import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../../utils';
import { recipeTypeController as controller } from './controller';

const router = Router();

// for /recipe-types

export function recipeTypeRouter() {
  router.get(
    '/:recipe_type_id',
    [param('recipe_type_id').trim().notEmpty()],
    catchExceptions(controller.viewOne)
  );

  router.get('/', catchExceptions(controller.viewAll));

  return router;
}
