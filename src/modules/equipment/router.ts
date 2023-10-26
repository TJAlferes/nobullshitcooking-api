import { Router } from 'express';
import { param }  from 'express-validator';

import { equipmentController } from './controller.js';
import { catchExceptions } from '../../utils/index.js';

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
