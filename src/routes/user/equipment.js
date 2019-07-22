const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userEquipmentController = require('../../controllers/user/equipment');

const router = Router();

// /v1/... ?

// for /user/equipment/...

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userEquipmentController.createEquipment)
);

router.put(
  '/update/:equipmentId',
  userIsAuth,
  catchExceptions(userEquipmentController.updateEquipment)
);

router.delete(
  '/delete/private/:equipmentId',
  userIsAuth,
  catchExceptions(userEquipmentController.deleteMyPrivateUserEquipment)
);

router.post(
  '/private',
  userIsAuth,
  catchExceptions(userEquipmentController.viewAllMyPrivateUserEquipment)
);

router.get(
  '/private/:equipmentId',
  userIsAuth,
  catchExceptions(userEquipmentController.viewMyPrivateUserEquipment)
);

module.exports = router;