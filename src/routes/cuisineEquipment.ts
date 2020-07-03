import { Router } from 'express';

import { cuisineEquipmentController } from '../controllers/cuisineEquipment';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /cuisine-equipment/...

router.get(
  '/:cuisineId',
  catchExceptions(
    cuisineEquipmentController.viewCuisineEquipmentByCuisineId
  )
);