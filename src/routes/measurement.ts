import { Router } from 'express';

import { measurementController } from '../controllers/measurement';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /measurement/...

router.get(
  '/',
  catchExceptions(measurementController.viewMeasurements)
);

router.get(
  '/:measurementId',
  catchExceptions(measurementController.viewMeasurementById)
);