import { Router } from 'express';
import { body }   from 'express-validator';

import { userController }              from './controller';
import { catchExceptions, userIsAuth } from '../../utils';

import { userPrivateRouter }        from './private/router';
import { userPublicRouter }         from './public/router';
import { userAuthenticationRouter } from './authentication/router';
//import { userAuthorizationRouter }  from './authorization/router';
import { userConfirmationRouter }   from './confirmation/router';
import { userFriendshipRouter }     from './friendship/router';
import { userSignedUrlRouter }      from './shared/signed-url/router';

const router = Router();

// for /user/...

export function userRouter() {
  router.use('/private',        userPrivateRouter());
  router.use('/public',         userPublicRouter());
  router.use('/authentication', userAuthenticationRouter());
  router.use('/confirmation',   userConfirmationRouter());
  router.use('/friendship',     userFriendshipRouter());
  //router.use('/profile',        userProfileRouter());
  router.use('/signed-url',     userSignedUrlRouter());

  router.post(
    '/create',
    sanitize(['email', 'password', 'username']),
    catchExceptions(userController.create)
  );

  router.put(
    '/update-email',
    userIsAuth,
    sanitize('new_email'),
    catchExceptions(userController.updateEmail)
  );  // why POST?

  router.put(
    '/update-password',
    userIsAuth,
    sanitize('new_password'),
    catchExceptions(userController.updatePassword)
  );  // why POST?

  router.put(
    '/update-username',
    userIsAuth,
    sanitize('new_username'),
    catchExceptions(userController.updateUsername)
  );  // why POST?

  router.delete(
    '/delete',
    userIsAuth,
    catchExceptions(userController.delete)
  );  // why POST?
  
  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
