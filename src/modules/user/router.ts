import { Router } from 'express';
import { body }   from 'express-validator';

import { userController }              from './controller';
import { catchExceptions, userIsAuth } from '../../utils';
import { userInitialDataRouter }       from './initial-data/router';
import { privateEquipmentRouter }      from './private-equipment/router';
import { privateIngredientRouter }     from './private-ingredient/router';
import { privatePlanRouter }           from './private-plan/router';
import { privateRecipeRouter }         from './private-recipe/router';
import { savedRecipeRouter }           from './saved-recipe/router';
import { friendshipRouter }            from './friendship/router';
import { profileRouter }               from './profile/router';
import { publicPlanRouter }            from './public-plan/router';
import { publicRecipeRouter }          from './public-recipe/router';
import { favoriteRecipeRouter }        from './favorite-recipe/router';
import { authenticationRouter }        from './authentication/router';
import { signedUrlRouter }             from './shared/signed-url/router';

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
