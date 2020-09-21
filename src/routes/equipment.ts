import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { EquipmentController } from '../controllers/equipment';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /equipment/...

export function equipmentRouter(pool: Pool) {
  const controller = new EquipmentController(pool);

  router.get(
    '/official/all',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/:id',
    [param('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewById)
  );

  return router;
}