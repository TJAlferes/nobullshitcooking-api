const { Router } = require('express');

const equipmentController = require('../controllers/equipment');

const router = Router();

// /v1/... ?

// for /equipment/...

router.post(
  '/',
  /* some validation, */
  catchExceptions(equipmentController.viewEquipment)
);

router.get(
  '/:equipmentId',
  /* some validation, */
  catchExceptions(equipmentController.viewEquipmentDetail)
);

module.exports = router;