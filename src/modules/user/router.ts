import { Router } from 'express';
import { body }   from 'express-validator';

import { userController }              from './controller';
import { catchExceptions, userIsAuth } from '../../utils';

import { userInitialDataRouter }   from './initial-data/router';
import { privateEquipmentRouter }  from './equipment/router';
import { privateIngredientRouter } from './ingredient/router';
import { privatePlanRouter }       from './plan/router';
import { privateRecipeRouter }     from './recipe/router';
import { userSavedRecipeRouter }   from './saved-recipe/router';
import { userFavoriteRecipeRouter } from './favorite-recipe/router';
import { userPublicPlanRouter }     from './plan/router';
import { userPublicRecipeRouter }   from './recipe/router';
import { profileRouter }            from './profile/router'
import { userAuthenticationRouter } from './authentication/router';
//import { userAuthorizationRouter }  from './authorization/router';
import { userConfirmationRouter }   from './confirmation/router';
import { userFriendshipRouter }     from './friendship/router';
import { userSignedUrlRouter }      from './shared/signed-url/router';

const router = Router();

// for /users...

export function userRouter() {
  router.use('/:username/private-equipment',   privateEquipmentRouter());

  router.use('/:username/private-ingredients', privateIngredientRouter());

  router.use('/:username/private-recipes',     privateRecipeRouter());
  router.use('/:username/public-recipes',      publicRecipeRouter());

  router.use('/:username/private-plans',       privatePlanRouter());
  router.use('/:username/public-plans',        publicPlanRouter());

  router.use('/:username/favorite-recipes',    favoriteRecipeRouter());

  router.use('/:username/saved-recipes',       savedRecipeRouter());

  router.use('/authentication', userAuthenticationRouter());  // just send their initial user data right when they login???
  router.use('/confirmation',   userConfirmationRouter());
  router.use('/friendship',     userFriendshipRouter());
  router.use('/profile',        profileRouter());
  router.use('/signed-url',     userSignedUrlRouter());

  router.post(
    '/',
    sanitize(['email', 'password', 'username']),
    catchExceptions(userController.create)
  );

  router.patch(
    '/email',
    userIsAuth,
    sanitize('new_email'),
    catchExceptions(userController.updateEmail)
  );

  router.patch(
    '/password',
    userIsAuth,
    sanitize('new_password'),
    catchExceptions(userController.updatePassword)
  );

  router.patch(
    '/username',
    userIsAuth,
    sanitize('new_username'),
    catchExceptions(userController.updateUsername)
  );

  router.delete(
    '/',
    userIsAuth,
    catchExceptions(userController.delete)
  );
  
  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
