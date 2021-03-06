import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { MeasurementController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /measurement/...

export function measurementRouter(pool: Pool) {
  const controller = new MeasurementController(pool);

  router.get(
    '/',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/:id',
    [param('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewById)
  );

  return router;
}