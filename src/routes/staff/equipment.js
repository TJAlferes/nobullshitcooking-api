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
  catchExceptions(staffEquipmentController.createEquipment)
);

router.put(
  '/update',
  staffIsAuth,
  catchExceptions(staffEquipmentController.updateEquipment)
);

router.delete(
  '/delete',
  staffIsAuth,
  catchExceptions(staffEquipmentController.deleteEquipment)
);

module.exports = router;