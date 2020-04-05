const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const equipmentTypeController = require('../controllers/equipmentType');

const router = Router();

// /v1/... ?

// for /equipment-type/...

router.get(
  '/',
  catchExceptions(equipmentTypeController.viewAllEquipmentTypes)
);

router.get(
  '/:equipmentTypeId',
  catchExceptions(equipmentTypeController.viewEquipmentTypeById)
);

module.exports = router;