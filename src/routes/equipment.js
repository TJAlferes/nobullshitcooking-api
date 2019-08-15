const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const equipmentController = require('../controllers/equipment');

const router = Router();

// /v1/... ?

// for /equipment/...

router.post(
  '/',
  catchExceptions(equipmentController.viewEquipment)
);

router.get(
  '/official/all',
  catchExceptions(equipmentController.viewAllOfficialEquipment)
);

router.get(
  '/:equipmentId',
  catchExceptions(equipmentController.viewEquipmentDetail)
);

module.exports = router;