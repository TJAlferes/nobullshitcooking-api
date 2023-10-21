import { Router } from 'express';
import { param }  from 'express-validator';

import { equipmentTypeController } from './controller.js';
import { catchExceptions } from '../../../utils/index.js';

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
