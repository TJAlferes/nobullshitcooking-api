import { Router } from 'express';
import { param }  from 'express-validator';

import { RecipeTypeController } from '../controllers';
import { catchExceptions }      from '../lib/utils';

const router = Router();

// for /recipe-type/...

export function recipeTypeRouter() {
  const controller = new RecipeTypeController();

  router.get('/', catchExceptions(controller.viewAll));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
