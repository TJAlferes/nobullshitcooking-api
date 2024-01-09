import { Router } from 'express';
import { body, param } from 'express-validator';

import { catchExceptions, userIsAuth } from '../../utils';
import { profileController } from './profile/controller';
//import { chatgroupRouter } from './chatgroup/router';
import { privateEquipmentRouter } from './private-equipment/router';
import { privateIngredientRouter } from './private-ingredient/router';
import { privatePlanRouter } from './private-plan/router';
import { privateRecipeRouter } from './private-recipe/router';
import { savedRecipeRouter } from './saved-recipe/router';
import { friendshipRouter } from './friendship/router';
import { userImageRouter } from './image/router';
import { publicPlanRouter } from './public-plan/router';
import { publicRecipeRouter } from './public-recipe/router';
import { favoriteRecipeRouter } from './favorite-recipe/router';
import { userController } from './controller';

const router = Router();

// for /users

export function userRouter() {
  router.use('/:username/avatars', sanitizeParams('username'), userImageRouter());
  router.use('/:username/public-plans', sanitizeParams('username'), publicPlanRouter());
  router.use('/:username/public-recipes', sanitizeParams('username'), publicRecipeRouter());
  router.use('/:username/favorite-recipes', sanitizeParams('username'), favoriteRecipeRouter());
  router.use('/:username/private-equipment', sanitizeParams('username'), privateEquipmentRouter());
  router.use('/:username/private-ingredients', sanitizeParams('username'), privateIngredientRouter());
  router.use('/:username/private-plans', sanitizeParams('username'), privatePlanRouter());
  router.use('/:username/private-recipes', sanitizeParams('username'), privateRecipeRouter());
  router.use('/:username/saved-recipes', sanitizeParams('username'), savedRecipeRouter());
  router.use('/:username/friendships', sanitizeParams('username'), friendshipRouter());

  router.get(
    '/:username',
    sanitizeParams('username'),
    catchExceptions(profileController.view)
  );

  router.patch(
    '/:username/email',
    userIsAuth,
    sanitizeParams('username'),
    sanitizeBody(['new_email', 'password']),
    catchExceptions(userController.updateEmail)
  );

  router.patch(
    '/:username/password',
    userIsAuth,
    sanitizeParams('username'),
    sanitizeBody(['new_password', 'current_password']),
    catchExceptions(userController.updatePassword)
  );

  router.patch(
    '/:username/username',
    userIsAuth,
    sanitizeParams('username'),
    sanitizeBody('new_username'),
    catchExceptions(userController.updateUsername)
  );

  router.post(
    '/:username/delete',
    userIsAuth,
    sanitizeParams('username'),
    sanitizeBody('password'),
    catchExceptions(userController.delete)
  );

  router.post(
    '/',
    sanitizeBody(['email', 'password', 'username']),
    catchExceptions(userController.create)
  );
  
  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).trim().notEmpty();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).trim().notEmpty();
}
