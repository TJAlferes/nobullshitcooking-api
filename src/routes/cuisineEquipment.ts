import { Router } from 'express';

const catchExceptions = require('../lib/utils/catchExceptions');

const cuisineEquipmentController = require('../controllers/cuisineEquipment');

export const router = Router();

// /v1/... ?

// for /cuisine-equipment/...

router.get(
  '/',
  catchExceptions(
    cuisineEquipmentController.viewCuisineEquipmentByCuisineId
  )
);