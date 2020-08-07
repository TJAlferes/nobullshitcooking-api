import { Router } from 'express';
import { param } from 'express-validator';

import { cuisineEquipmentController } from '../controllers/cuisineEquipment';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /cuisine-equipment/...

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(cuisineEquipmentController.viewByCuisineId)
);