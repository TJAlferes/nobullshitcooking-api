import { Router } from 'express';
import { body } from 'express-validator';

import { catchExceptions, userIsAuth } from '../../utils';
//import { chatgroupRouter } from './chatgroup/router';
import { privateEquipmentRouter } from './private-equipment/router';
import { privateIngredientRouter } from './private-ingredient/router';
import { privatePlanRouter } from './private-plan/router';
import { privateRecipeRouter } from './private-recipe/router';
import { savedRecipeRouter } from './saved-recipe/router';
import { friendshipRouter } from './friendship/router';
import { publicPlanRouter } from './public-plan/router';
import { publicRecipeRouter } from './public-recipe/router';
import { favoriteRecipeRouter } from './favorite-recipe/router';
import { userController } from './controller';
import { userImageRouter } from './image/router';

const router = Router();

// for /users

export function userRouter() {
  router.use(':/username/avatars', userImageRouter());
  router.use('/:username/public-plans', publicPlanRouter());
  router.use('/:username/public-recipes', publicRecipeRouter());
  router.use('/:username/favorite-recipes', favoriteRecipeRouter());
  router.use('/:username/private-equipment', privateEquipmentRouter());
  router.use('/:username/private-ingredients', privateIngredientRouter());
  router.use('/:username/private-plans', privatePlanRouter());
  router.use('/:username/private-recipes', privateRecipeRouter());
  router.use('/:username/saved-recipes', savedRecipeRouter());
  router.use('/:username/friendships', friendshipRouter());

  router.post(
    '/',
    sanitizeBody(['email', 'password', 'username']),
    catchExceptions(userController.create)
  );

  router.patch(
    '/:username/email',
    userIsAuth,
    sanitizeBody('new_email'),
    catchExceptions(userController.updateEmail)
  );

  router.patch(
    '/:username/password',
    userIsAuth,
    sanitizeBody('new_password'),
    catchExceptions(userController.updatePassword)
  );

  router.patch(
    '/:username/username',
    userIsAuth,
    sanitizeBody('new_username'),
    catchExceptions(userController.updateUsername)
  );

  router.delete(
    '/:username',
    userIsAuth,
    catchExceptions(userController.delete)
  );
  
  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).trim().notEmpty();
}
