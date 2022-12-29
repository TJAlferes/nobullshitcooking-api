import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { RecipeTypeController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /recipe-type/...

export function recipeTypeRouter(pool: Pool) {
  const controller = new RecipeTypeController(pool);

  router.get('/', catchExceptions(controller.view));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewById));

  return router;
}