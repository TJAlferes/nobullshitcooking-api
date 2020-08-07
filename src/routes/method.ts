import { Router } from 'express';
import { param } from 'express-validator';

import { methodController } from '../controllers/method';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /method/...

router.get(
  '/',
  catchExceptions(methodController.view)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(methodController.viewById)
);