import { Router } from 'express';

import { cuisineEquipmentController } from '../controllers/cuisineEquipment';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// /v1/... ?

// for /cuisine-equipment/...

router.get(
  '/',
  catchExceptions(
    cuisineEquipmentController.viewCuisineEquipmentByCuisineId
  )
);