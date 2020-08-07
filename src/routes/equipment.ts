import { Router } from 'express';
import { param } from 'express-validator';

import { equipmentController } from '../controllers/equipment';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /equipment/...

router.get(
  '/official/all',
  catchExceptions(equipmentController.view)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(equipmentController.viewById)
);