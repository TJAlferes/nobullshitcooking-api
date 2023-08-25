import { Router } from 'express';
import { param }  from 'express-validator';

import { equipmentTypeController } from './controller';
import { catchExceptions }         from '../../../utils';

const router = Router();

// for /equipment-type/...

export function equipmentTypeRouter() {
  router.get('/', catchExceptions(equipmentTypeController.viewAll));

  router.get(
    '/:equipment_type_id',
    [param('equipment_type_id').not().isEmpty().trim().escape()],
    catchExceptions(equipmentTypeController.viewOne)
  );

  return router;
}
