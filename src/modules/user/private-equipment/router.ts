import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth }              from '../../../../utils';
import { privateEquipmentController as controller } from './controller';

const router = Router();

// for /users/:username/private-equipment

export function privateEquipmentRouter() {
  const equipment_upload = [
    'equipment_type_id',
    'equipment_name',
    'notes',
    'image*'
  ];

  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.get(
    '/:equipment_id',
    userIsAuth,
    bodySanitizer('equipment_id'),
    catchExceptions(controller.viewOne)
  );

  router.post(
    '/',
    userIsAuth,
    bodySanitizer(equipment_upload),
    catchExceptions(controller.create)
  );

  router.get(
    '/edit',
    userIsAuth,
    bodySanitizer('equipment_id'),
    catchExceptions(controller.edit)
  );

  router.put(
    '/',
    userIsAuth,
    bodySanitizer(['equipment_id', ...equipment_upload]),
    catchExceptions(controller.update)
  );

  router.delete(
    '/',
    userIsAuth,
    bodySanitizer('equipment_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function bodySanitizer(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
