const { Router } = require('express');
const { body } = require('express-validator');

const catchExceptions = require('../../lib/utils/catchExceptions');
const staffIsAuth = require('../../lib/utils/staffIsAuth');

const staffCuisineEquipmentController = require(
  '../../controllers/staff/cuisineEquipment'
);

const router = Router();

// /v1/... ?

// for /staff/cuisine-equipment/...

router.post(
  '/',
  staffIsAuth,
  catchExceptions(
    staffCuisineEquipmentController.viewCuisineEquipmentByCuisineId
  )
);

router.post(
  '/create',
  staffIsAuth,
  [body('equipmentId').not().isEmpty().trim().escape()],
  catchExceptions(
    staffCuisineEquipmentController.createCuisineEquipment
  )
);

router.delete(
  '/delete',
  staffIsAuth,
  [
    body('cuisineId').not().isEmpty().trim().escape(),
    body('equipmentId').not().isEmpty().trim().escape()
  ],
  catchExceptions(
    staffCuisineEquipmentController.deleteCuisineEquipment
  )
);

module.exports = router;