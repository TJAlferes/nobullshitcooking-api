import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { CuisineEquipmentController } from '../controllers/cuisineEquipment';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /cuisine-equipment/...

export function cuisineEquipmentRouter(pool: Pool) {
  const controller = new CuisineEquipmentController(pool);

  router.get(
    '/:cuisine',
    [param('cuisine').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewByCuisine)
  );

  return router;
}