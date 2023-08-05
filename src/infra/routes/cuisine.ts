import { Router } from 'express';
import { param }  from 'express-validator';

import { CuisineController } from '../controllers';
import { catchExceptions }   from '../lib/utils';

const router = Router();

// for /cuisine/...

export function cuisineRouter() {
  const controller = new CuisineController();

  router.get('/', catchExceptions(controller.viewAll));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
