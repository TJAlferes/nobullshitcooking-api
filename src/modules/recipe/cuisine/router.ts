import { Router } from 'express';
import { param }  from 'express-validator';

import { cuisineController as controller } from './controller';
import { catchExceptions }   from '../../../utils';

const router = Router();

// for /cuisine/...

export function cuisineRouter() {
  router.get('/', catchExceptions(controller.viewAll));

  router.get(
    '/:cuisine_id',
    [param('cuisine_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
};
