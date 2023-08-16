import { Router } from 'express';
import { body }   from 'express-validator';

import { UserEquipmentController }     from '../../../controllers/user/private';
import { catchExceptions, userIsAuth } from '../../../lib/utils';

const router = Router();

// for /user/private/equipment/...

export function userEquipmentRouter() {
  const controller = new UserEquipmentController();

  const equipmentInfo = [
    'equipment_type_id',
    'equipment_name',
    'description',
    'image_id'
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
    bodySanitizer(equipmentInfo),
    catchExceptions(controller.create)
  );

  /*router.post(
    '/edit',
    userIsAuth,
    catchExceptions(controller.edit)
  );*/

  router.put(
    '/update',
    userIsAuth,
    bodySanitizer(['equipment_id', ...equipmentInfo]),
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
