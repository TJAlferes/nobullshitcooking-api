import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import {
  StaffCuisineEquipmentController
} from '../../controllers/staff/cuisineEquipment';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

const router = Router();

// for /staff/cuisine-equipment/...

export function staffCuisineEquipmentRouter(pool: Pool) {
  const controller = new StaffCuisineEquipmentController(pool);

  router.post(
    '/create',
    staffIsAuth,
    [
      body('cuisineId').not().isEmpty().trim().escape(),
      body('equipmentId').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.create)
  );

  router.delete(
    '/delete',
    staffIsAuth,
    [
      body('cuisineId').not().isEmpty().trim().escape(),
      body('equipmentId').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.delete)
  );

  return router;
}