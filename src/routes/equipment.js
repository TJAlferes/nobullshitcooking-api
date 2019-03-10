const { Router } = require('express');

const equipmentController = require('../controllers/equipment');

const router = Router();

// /v1/... ?

// for /equipment/...

router.get(
  '/',
  /* some validation, */
  catchExceptions(equipmentController.viewEquipment)
);

router.get(
  '/:equipmentId',
  /* some validation, */
  catchExceptions(equipmentController.viewEquipmentDetail)
);

router.post(
  '/create',
  /* some validation, */
  catchExceptions(equipmentController.createEquipment)
);

router.put(
  '/update',
  /* some validation, */
  catchExceptions(equipmentController.updateEquipment)
);

router.delete(
  '/delete',
  /* some validation, */
  catchExceptions(equipmentController.deleteEquipment)
);

module.exports = router;