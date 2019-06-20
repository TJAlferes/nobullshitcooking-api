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
  /*isValid,*/
  catchExceptions(userEquipmentController.createUserEquipment)
);

router.put(
  '/update/:equipmentId',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userEquipmentController.updateUserEquipment)
);

router.delete(
  '/delete/:equipmentId',
  userIsAuth,
  catchExceptions(userEquipmentController.deleteUserEquipment)
);

router.post(
  '/',
  userIsAuth,
  catchExceptions(userEquipmentController.viewUserEquipment)
);

router.get(
  '/:equipmentId',
  userIsAuth,
  catchExceptions(userEquipmentController.viewUserEquipmentDetail)
);

module.exports = router;