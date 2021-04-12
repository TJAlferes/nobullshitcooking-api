import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { EquipmentTypeController } from '../controllers';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /equipment-type/...

export function equipmentTypeRouter(pool: Pool) {
  const controller = new EquipmentTypeController(pool);

  router.get(
    '/',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/:name',
    [param('name').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewByName)
  );

  return router;
}