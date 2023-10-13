import { Router } from 'express';
import { param }  from 'express-validator';

import { cuisineController as controller } from './controller.js';
import { catchExceptions }   from '../../../index.js';

const router = Router();

// for /cuisines

export function cuisineRouter() {
  router.get(
    '/:cuisine_id',
    [param('cuisine_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  router.get('/', catchExceptions(controller.viewAll));

  return router;
};
