import { Router }      from 'express';
import { body, param } from 'express-validator';

import { chatroomController }          from './controller';
import { catchExceptions, userIsAuth } from '../../../utils';

const router = Router();

// for /chatrooms

export function chatroomRouter() {
  router.get(
    '/:chatroom_name',
    [param('chatroom_name').not().isEmpty().trim().escape()],
    catchExceptions(chatroomController.viewOne)
  );

  router.post(
    '/',
    userIsAuth,
    sanitize('chatroom_name'),
    catchExceptions(chatroomController.create)
  );

  // uses case: change name
  router.patch(
    '/',
    userIsAuth,
    sanitize('chatroom_name'),
    catchExceptions(chatroomController.update)
  );
  
  router.delete(
    '/',
    userIsAuth,
    catchExceptions(chatroomController.delete)
  );
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
