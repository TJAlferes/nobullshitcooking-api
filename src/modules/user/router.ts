import { Router } from 'express';
import { body }   from 'express-validator';

import { UserController }              from './controller';
import { catchExceptions, userIsAuth } from '../../utils';

import { userPrivateRouter }        from './private';
import { userPublicRouter }         from './public';
import { userAuthenticationRouter } from './authentication';
//import { userAuthorizationRouter } from './authorization';
import { userConfirmationRouter }   from './confirmation/router';
import { userDataInitRouter  }      from './dataInit';
import { userFavoriteRecipeRouter } from './favorite-recipe/router';
import { userFriendshipRouter }     from './friendship/router';
import { userSignedUrlRouter }      from './signed-url/router';

const router = Router();

// for /user/...

export function userRouter() {
  router.use('/private',         userPrivateRouter());

  router.use('/authentication',  userAuthenticationRouter());
  router.use('/confirmation',    userConfirmationRouter());
  router.use('/data-init',       userDataInitRouter());
  router.use('/favorite-recipe', userFavoriteRecipeRouter());
  router.use('/friendship',      userFriendshipRouter());
  router.use('/plan',            userPublicPlanRouter());
  //router.use('/profile',         userProfileRouter());
  router.use('/recipe',          userPublicRecipeRouter());
  router.use('/signed-url',      userSignedUrlRouter());

  const controller = new UserController();

  router.post(
    '/create',
    sanitize(['email', 'password', 'username']),
    catchExceptions(controller.create)
  );
  router.post(
    '/update',
    userIsAuth,
    sanitize(['email', 'password', 'username']),
    catchExceptions(controller.update)
  );  // why POST?

  router.post(
    '/delete',
    userIsAuth,
    catchExceptions(controller.delete)
  );  // why POST?
  
  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
