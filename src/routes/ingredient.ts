import { Router } from 'express';
import { param } from 'express-validator';

import { ingredientController } from '../controllers/ingredient';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /ingredient/...

router.get(
  '/official/all',
  catchExceptions(ingredientController.view)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(ingredientController.viewById)
);