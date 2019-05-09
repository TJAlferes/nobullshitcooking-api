const { Router } = require('express');

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffEquipmentController = require('../../controllers/staff/equipment');

const router = Router();

// /v1/... ?

// for /staff/equipment/...

router.post(
  '/create',
  staffIsAuth,
  /*isValid,*/
  catchExceptions(staffEquipmentController.createEquipment)
);

router.put(
  '/edit/:equipmentId',
  staffIsAuth,
  /*isValid,*/
  catchExceptions(staffEquipmentController.updateEquipment)
);

router.delete(
  '/delete/:equipmentId',
  staffIsAuth,
  catchExceptions(staffEquipmentController.deleteEquipment)
);

module.exports = router;