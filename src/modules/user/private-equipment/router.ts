import { Router } from 'express';
import { body, param } from 'express-validator';

import { catchExceptions, userIsAuth }              from '../../../utils/index';
import { privateEquipmentController as controller } from './controller';

const router = Router();

// for /users/:username/private-equipment

export function privateEquipmentRouter() {
  const equipment_upload = [
    'equipment_type_id',
    'equipment_name',
    'notes',
    'image_filename',
    'caption'
  ];

  router.get(
    '/:equipment_id',
    userIsAuth,
    sanitizeParams('equipment_id'),
    catchExceptions(controller.viewOne)
  );

  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/',
    userIsAuth,
    sanitizeBody(equipment_upload),
    catchExceptions(controller.create)
  );

  router.patch(
    '/',
    userIsAuth,
    sanitizeBody(['equipment_id', 'image_id', ...equipment_upload]),
    catchExceptions(controller.update)
  );

  router.delete(
    '/:equipment_id',
    userIsAuth,
    sanitizeParams('equipment_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).not().isEmpty().trim().escape();
}
