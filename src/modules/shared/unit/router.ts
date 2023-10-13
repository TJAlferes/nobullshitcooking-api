import { Router } from 'express';
import { param }  from 'express-validator';

import { unitController }  from './controller.js';
import { catchExceptions } from '../../../utils/index.js';

const router = Router();

// for /units

export function unitRouter() {
  router.get(
    '/:unit_id',
    [param('unit_id').not().isEmpty().trim().escape()],
    catchExceptions(unitController.viewOne)
  );

  router.get('/', catchExceptions(unitController.viewAll));

  return router;
}
