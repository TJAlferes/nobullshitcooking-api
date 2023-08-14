import { Router } from 'express';
import { param }  from 'express-validator';

import { UnitController }  from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /unit/...

export function unitRouter() {
  const controller = new UnitController();

  router.get('/', catchExceptions(controller.viewAll));

  router.get(
    '/:unit_id',
    [param('unit_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
}
