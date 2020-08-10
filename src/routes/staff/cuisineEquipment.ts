import { Router } from 'express';
import { body } from 'express-validator';

import {
  staffCuisineEquipmentController
} from '../../controllers/staff/cuisineEquipment';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// for /staff/cuisine-equipment/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('cuisineId').not().isEmpty().trim().escape(),
    body('equipmentId').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffCuisineEquipmentController.create)
);

router.delete(
  '/delete',
  staffIsAuth,
  [
    body('cuisineId').not().isEmpty().trim().escape(),
    body('equipmentId').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffCuisineEquipmentController.delete)
);