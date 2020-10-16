import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { MeasurementController } from '../controllers/measurement';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /measurement/...

export function measurementRouter(pool: Pool) {
  const controller = new MeasurementController(pool);

  router.get(
    '/',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/:name',
    [param('name').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewByName)
  );

  return router;
}