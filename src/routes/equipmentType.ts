import { Router } from 'express';
import { param }  from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { EquipmentTypeController } from '../controllers';
import { catchExceptions }         from '../lib/utils';

const router = Router();

// for /equipment-type/...

export function equipmentTypeRouter(pool: Pool) {
  const controller = new EquipmentTypeController(pool);

  router.get('/', catchExceptions(controller.viewAll));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
