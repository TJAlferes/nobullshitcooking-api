import { Router } from 'express';

import { equipmentController } from '../controllers/equipment';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// /v1/... ?

// for /equipment/...

router.get(
  '/official/all',
  catchExceptions(equipmentController.viewEquipment)
);

router.get(
  '/:equipmentId',
  catchExceptions(equipmentController.viewEquipmentById)
);