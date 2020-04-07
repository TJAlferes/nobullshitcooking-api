import { Router } from 'express';

const catchExceptions = require('../lib/utils/catchExceptions');
const equipmentController = require('../controllers/equipment');

export const router = Router();

// /v1/... ?

// for /equipment/...

router.get(
  '/official/all',
  catchExceptions(equipmentController.viewAllOfficialEquipment)
);

router.get(
  '/:equipmentId',
  catchExceptions(equipmentController.viewEquipmentDetail)
);