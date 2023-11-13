import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../../utils';
import { equipmentTypeController } from './controller';

const router = Router();

// for /equipment-types

export function equipmentTypeRouter() {
  router.get('/', catchExceptions(equipmentTypeController.viewAll));

  router.get(
    '/:equipment_type_id',
    [param('equipment_type_id').not().isEmpty().trim().escape()],
    catchExceptions(equipmentTypeController.viewOne)
  );

  return router;
}
