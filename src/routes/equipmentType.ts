import { Router } from 'express';

import { equipmentTypeController } from '../controllers/equipmentType';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /equipment-type/...

router.get(
  '/',
  catchExceptions(equipmentTypeController.viewEquipmentTypes)
);

router.get(
  '/:equipmentTypeId',
  catchExceptions(equipmentTypeController.viewEquipmentTypeById)
);