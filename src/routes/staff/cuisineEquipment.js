const { Router } = require('express');

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
  catchExceptions(
    staffCuisineEquipmentController.createCuisineEquipment
  )
);

router.delete(
  '/delete',
  staffIsAuth,
  catchExceptions(
    staffCuisineEquipmentController.deleteCuisineEquipment
  )
);

module.exports = router;