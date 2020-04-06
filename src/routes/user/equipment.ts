const { Router } = require('express');
import { body } from 'express-validator';

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
  [body('equipmentId').not().isEmpty().trim().escape()],
  catchExceptions(userEquipmentController.viewMyPrivateUserEquipment)
);

router.post(
  '/create',
  userIsAuth,
  [
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('equipmentName').not().isEmpty().trim().escape(),
    body('equipmentDescription').not().isEmpty().trim().escape(),
    body('equipmentImage').not().isEmpty().trim().escape(),
  ],
  catchExceptions(userEquipmentController.createMyPrivateUserEquipment)
);

router.put(
  '/update',
  userIsAuth,
  [
    body('equipmentId').not().isEmpty().trim().escape(),
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('equipmentName').not().isEmpty().trim().escape(),
    body('equipmentDescription').not().isEmpty().trim().escape(),
    body('equipmentImage').not().isEmpty().trim().escape(),
  ],
  catchExceptions(userEquipmentController.updateMyPrivateUserEquipment)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('equipmentId').not().isEmpty().trim().escape()],
  catchExceptions(userEquipmentController.deleteMyPrivateUserEquipment)
);

module.exports = router;