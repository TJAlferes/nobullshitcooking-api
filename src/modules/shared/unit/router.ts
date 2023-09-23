import { Router } from 'express';
import { param }  from 'express-validator';

import { unitController }  from './controller';
import { catchExceptions } from '../../../utils';

const router = Router();

// for /units

export function unitRouter() {
  router.get('/', catchExceptions(unitController.viewAll));

  router.get(
    '/:unit_id',
    [param('unit_id').not().isEmpty().trim().escape()],
    catchExceptions(unitController.viewOne)
  );

  return router;
}
