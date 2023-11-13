import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../utils';
import { equipmentController } from './controller';

const router = Router();

// for /equipment

export function equipmentRouter() {
  router.get(
    '/:equipment_id',
    [param('equipment_id').not().isEmpty().trim().escape()],
    catchExceptions(equipmentController.viewOne)
  );

  router.get('/', catchExceptions(equipmentController.viewAll));

  return router;
}
