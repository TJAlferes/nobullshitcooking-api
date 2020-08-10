import { Router } from 'express';
import { body } from 'express-validator';

import { staffEquipmentController } from '../../controllers/staff/equipment';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// for /staff/equipment/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffEquipmentController.create)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('id').not().isEmpty().trim().escape(),
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffEquipmentController.update)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(staffEquipmentController.delete)
);