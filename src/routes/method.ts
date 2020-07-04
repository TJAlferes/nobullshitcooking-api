import { Router } from 'express';

import { methodController } from '../controllers/method';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /method/...

router.get(
  '/',
  catchExceptions(methodController.viewMethods)
);

router.get(
  '/:methodId',
  catchExceptions(methodController.viewMethodById)
);