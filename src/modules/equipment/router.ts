import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../utils';
import { equipmentController as controller } from './controller';

const router = Router();

// for /equipment

export function equipmentRouter() {
  router.get(
    '/names',
    catchExceptions(controller.viewAllOfficialNames)
  );

  router.get(
    '/:equipment_name',
    [param('equipment_name').trim().notEmpty()],
    catchExceptions(controller.viewOneByName)
  );

  router.get(
    '/',
    catchExceptions(controller.viewAll)
  );

  return router;
}
