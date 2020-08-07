import { Router } from 'express';
import { param } from 'express-validator';

import { cuisineController } from '../controllers/cuisine';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /cuisine/...

router.get(
  '/',
  catchExceptions(cuisineController.view)
);

router.get(
  '/detail/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(cuisineController.viewDetailById)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(cuisineController.viewById)
);