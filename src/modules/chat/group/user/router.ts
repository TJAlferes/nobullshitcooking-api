/*import { Router } from 'express';
import { body }   from 'express-validator';

import { chatgroupUserController }     from './controller.js';
import { catchExceptions, userIsAuth } from '../../../../index.js';

const router = Router();

// for /chatgroups/:chatgroup_name/users

export function chatgroupUserRouter() {
  router.get(
    '/',
    catchExceptions(chatgroupUserController.viewAll)
  );

  router.post(
    '/',
    userIsAuth,
    sanitize(['chatgroup_id, user_id']),
    catchExceptions(chatgroupUserController.create)
  );
  
  router.delete(
    '/',
    userIsAuth,
    catchExceptions(chatgroupUserController.delete)
  );
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
*/