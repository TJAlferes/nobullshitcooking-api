import { Router }      from 'express';
import { body, param } from 'express-validator';

import { chatgroupController }         from './controller';
import { catchExceptions, userIsAuth } from '../../../utils';

const router = Router();

// for /users/:username/chatgroups

export function chatgroupRouter() {
  router.get(
    '/:chatgroup_name',
    userIsAuth,
    param('chatgroup_name').not().isEmpty().trim().escape(),
    catchExceptions(chatgroupController.viewOne)
  );

  router.get(
    '/',
    userIsAuth,
    catchExceptions(chatgroupController.viewAll)
  );

  router.post(
    '/',
    userIsAuth,
    sanitize('chatgroup_name'),
    catchExceptions(chatgroupController.create)
  );

  // uses cases:
  // change owner
  // change name
  // manually change invite code
  router.patch(
    '/',
    userIsAuth,
    sanitize('chatgroup_name'),
    catchExceptions(chatgroupController.update)
  );
  
  router.delete(
    '/:chatgroup_name',
    userIsAuth,
    param('chatgroup_name').not().isEmpty().trim().escape(),
    catchExceptions(chatgroupController.delete)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
