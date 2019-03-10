const { Router } = require('express');

const equipmentTypeController = require('../controllers/equipmentType');

const router = Router();

// /v1/... ?

// for /equipment-type/...

router.get(
  '/',
  /* some validation, */
  catchExceptions(equipmentTypeController.viewAllEquipmentTypes)
);

router.get(
  '/:equipmentTypeId',
  /* some validation, */
  catchExceptions(equipmentTypeController.viewEquipmentTypeById)
);

module.exports = router;