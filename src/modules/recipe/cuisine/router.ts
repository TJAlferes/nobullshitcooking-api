import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../../utils';
import { cuisineController as controller } from './controller';

const router = Router();

// for /cuisines

export function cuisineRouter() {
  router.get(
    '/:cuisine_id',
    [param('cuisine_id').trim().notEmpty()],
    catchExceptions(controller.viewOne)
  );

  router.get('/', catchExceptions(controller.viewAll));

  return router;
};
