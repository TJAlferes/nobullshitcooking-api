const { Router } = require('express');
import { body } from 'express-validator';

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffEquipmentController = require('../../controllers/staff/equipment');

const router = Router();

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

module.exports = router;