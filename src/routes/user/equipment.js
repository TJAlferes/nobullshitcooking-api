const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userEquipmentController = require('../../controllers/user/equipment');

const router = Router();

// /v1/... ?

// for /user/equipment/...

router.post(
  '/all',
  userIsAuth,
  catchExceptions(userEquipmentController.viewAllMyPrivateUserEquipment)
);

router.post(
  '/one',
  userIsAuth,
  catchExceptions(userEquipmentController.viewMyPrivateUserEquipment)
);

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userEquipmentController.createMyPrivateUserEquipment)
);

router.put(
  '/update',
  userIsAuth,
  catchExceptions(userEquipmentController.updateMyPrivateUserEquipment)
);

router.delete(
  '/delete',
  userIsAuth,
  catchExceptions(userEquipmentController.deleteMyPrivateUserEquipment)
);

module.exports = router;