const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');

const cuisineEquipmentController = require('../controllers/cuisineEquipment');

const router = Router();

// /v1/... ?

// for /cuisine-equipment/...

router.get(
  '/',
  catchExceptions(
    cuisineEquipmentController.viewCuisineEquipmentByCuisineId
  )
);