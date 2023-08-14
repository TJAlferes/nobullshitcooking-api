import { Router } from 'express';
import { param }  from 'express-validator';

import { EquipmentController } from '../controllers';
import { catchExceptions }     from '../lib/utils';

const router = Router();

// for /equipment/...

export function equipmentRouter() {
  const controller = new EquipmentController();

  router.get('/', catchExceptions(controller.viewAll));

  router.get(
    '/:equipment_id',
    [param('equipment_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
}
