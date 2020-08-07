import { Router } from 'express';
import { param } from 'express-validator';

import { equipmentTypeController } from '../controllers/equipmentType';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /equipment-type/...

router.get(
  '/',
  catchExceptions(equipmentTypeController.view)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(equipmentTypeController.viewById)
);