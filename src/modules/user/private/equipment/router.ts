import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth }              from '../../../../utils';
import { privateEquipmentController as controller } from './controller';

const router = Router();

// for /user/private/equipment/...

export function privateEquipmentRouter() {
  const equipment_upload = [
    'equipment_type_id',
    'equipment_name',
    'notes',
    'image*'
  ];

  router.post(
    '/all',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/one',
    userIsAuth,
    bodySanitizer('equipment_id'),
    catchExceptions(controller.viewOne)
  );

  router.post(
    '/create',
    userIsAuth,
    bodySanitizer(equipment_upload),
    catchExceptions(controller.create)
  );

  router.post(
    '/edit',
    userIsAuth,
    bodySanitizer('equipment_id'),
    catchExceptions(controller.edit)
  );

  router.put(
    '/update',
    userIsAuth,
    bodySanitizer(['equipment_id', ...equipment_upload]),
    catchExceptions(controller.update)
  );

  router.delete(
    '/delete',
    userIsAuth,
    bodySanitizer('equipment_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function bodySanitizer(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
