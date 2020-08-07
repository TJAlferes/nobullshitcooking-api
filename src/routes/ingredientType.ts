import { Router } from 'express';
import { param } from 'express-validator';

import { ingredientTypeController } from '../controllers/ingredientType';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /ingredient-type/...

router.get(
  '/',
  catchExceptions(ingredientTypeController.view)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(ingredientTypeController.viewById)
);