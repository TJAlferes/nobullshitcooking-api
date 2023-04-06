import { Router } from 'express';
import { param }  from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { EquipmentController } from '../controllers';
import { catchExceptions }     from '../lib/utils';

const router = Router();

// for /equipment/...

export function equipmentRouter(pool: Pool) {
  const controller = new EquipmentController(pool);

  router.get('/', catchExceptions(controller.viewAll));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
