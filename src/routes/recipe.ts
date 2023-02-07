import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { RecipeController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /recipe/...

export function recipeRouter(pool: Pool) {
  const controller = new RecipeController(pool);

  router.get('/', catchExceptions(controller.view));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewById));

  return router;
}