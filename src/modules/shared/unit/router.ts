import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../../utils';
import { unitController } from './controller';

const router = Router();

// for /units

export function unitRouter() {
  router.get(
    '/:unit_id',
    [param('unit_id').trim().notEmpty()],
    catchExceptions(unitController.viewOne)
  );

  router.get('/', catchExceptions(unitController.viewAll));

  return router;
}
