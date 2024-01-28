import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../../utils';
import { equipmentTypeController } from './controller';

const router = Router();

// for /equipment-types

export function equipmentTypeRouter() {
  router.get(
    '/:equipment_type_id',
    [param('equipment_type_id').trim().notEmpty()],
    catchExceptions(equipmentTypeController.viewOne)
  );

  router.get('/', catchExceptions(equipmentTypeController.viewAll));

  return router;
}
