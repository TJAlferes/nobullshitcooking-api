import { Router } from 'express';
import { param }  from 'express-validator';

import { EquipmentTypeController } from '../controllers';
import { catchExceptions }         from '../lib/utils';

const router = Router();

// for /equipment-type/...

export function equipmentTypeRouter() {
  const controller = new EquipmentTypeController();

  router.get('/', catchExceptions(controller.viewAll));

  router.get(
    '/:equipment_type_id',
    [param('equipment_type_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
}
