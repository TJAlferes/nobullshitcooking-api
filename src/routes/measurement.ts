import { Router } from 'express';
import { param } from 'express-validator';

import { measurementController } from '../controllers/measurement';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /measurement/...

router.get(
  '/',
  catchExceptions(measurementController.view)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(measurementController.viewById)
);