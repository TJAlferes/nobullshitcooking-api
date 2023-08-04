import { Router } from 'express';
import { param }  from 'express-validator';

import { MeasurementController } from '../controllers';
import { catchExceptions }       from '../lib/utils';

const router = Router();

// for /measurement/...

export function measurementRouter() {
  const controller = new MeasurementController();

  router.get('/', catchExceptions(controller.viewAll));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
