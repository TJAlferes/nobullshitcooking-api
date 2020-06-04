import { Router } from 'express';
import { body } from 'express-validator';

import { staffEquipmentController } from '../../controllers/staff/equipment';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// /v1/... ?

// for /staff/equipment/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('equipmentName').not().isEmpty().trim().escape(),
    body('equipmentDescription').not().isEmpty().trim().escape(),
    body('equipmentImage').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffEquipmentController.createEquipment)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('equipmentId').not().isEmpty().trim().escape(),
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('equipmentName').not().isEmpty().trim().escape(),
    body('equipmentDescription').not().isEmpty().trim().escape(),
    body('equipmentImage').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffEquipmentController.updateEquipment)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('equipmentId').not().isEmpty().trim().escape()],
  catchExceptions(staffEquipmentController.deleteEquipment)
);