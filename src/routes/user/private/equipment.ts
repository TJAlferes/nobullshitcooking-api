import { Router } from 'express';
import { body }   from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { UserEquipmentController }     from '../../../controllers/user/private';
import { catchExceptions, userIsAuth } from '../../../lib/utils';

const router = Router();

// for /user/private/equipment/...

export function userEquipmentRouter(pool: Pool) {
  const controller = new UserEquipmentController(pool);

  const equipmentInfo = [
    'equipmentTypeId',
    'name',
    'description',
    'image'
  ];

  router.post('/all',      userIsAuth,                                            catchExceptions(controller.viewAll));
  router.post('/one',      userIsAuth, [bodySanitizer('id')],                     catchExceptions(controller.viewOne));
  router.post('/create',   userIsAuth, [bodySanitizer(equipmentInfo)],            catchExceptions(controller.create));
  //router.post('/edit',     userIsAuth,                                            catchExceptions(controller.edit));
  router.put('/update',    userIsAuth, [bodySanitizer(['id', ...equipmentInfo])], catchExceptions(controller.update));
  router.delete('/delete', userIsAuth, [bodySanitizer('id')],                     catchExceptions(controller.deleteOne));

  return router;
}

function bodySanitizer(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
