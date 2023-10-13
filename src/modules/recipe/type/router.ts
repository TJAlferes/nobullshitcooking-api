import { Router } from 'express';
import { param }  from 'express-validator';

import { recipeTypeController as controller } from './controller.js';
import { catchExceptions } from '../../../index.js';

const router = Router();

// for /recipe-types

export function recipeTypeRouter() {
  router.get(
    '/:recipe_type_id',
    [param('recipe_type_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  router.get('/', catchExceptions(controller.viewAll));

  return router;
}
