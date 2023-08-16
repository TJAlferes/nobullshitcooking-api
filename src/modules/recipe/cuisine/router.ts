import { Router } from 'express';
import { param }  from 'express-validator';

import { CuisineController } from './controller';
import { catchExceptions }   from '../../../utils';

const router = Router();

// for /cuisine/...

export function cuisineRouter() {
  const controller = new CuisineController();

  router.get('/', catchExceptions(controller.viewAll));

  router.get(
    '/:cuisine_id',
    [param('cuisine_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
}
