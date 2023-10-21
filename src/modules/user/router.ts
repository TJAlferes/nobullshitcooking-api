import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth } from '../../utils/index.js';
//import { chatgroupRouter }             from './chatgroup/router.js';
import { privateEquipmentRouter }      from './private-equipment/router.js';
import { privateIngredientRouter }     from './private-ingredient/router.js';
import { privatePlanRouter }           from './private-plan/router.js';
import { privateRecipeRouter }         from './private-recipe/router.js';
import { savedRecipeRouter }           from './saved-recipe/router.js';
import { friendshipRouter }            from './friendship/router.js';
import { publicPlanRouter }            from './public-plan/router.js';
import { publicRecipeRouter }          from './public-recipe/router.js';
import { favoriteRecipeRouter }        from './favorite-recipe/router.js';
import { userController }              from './controller.js';
import { userImageRouter } from './image/router.js';

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
    sanitize(['email', 'password', 'username']),
    catchExceptions(userController.create)
  );

  router.patch(
    '/:username/email',
    userIsAuth,
    sanitize('new_email'),
    catchExceptions(userController.updateEmail)
  );

  router.patch(
    '/:username/password',
    userIsAuth,
    sanitize('new_password'),
    catchExceptions(userController.updatePassword)
  );

  router.patch(
    '/:username/username',
    userIsAuth,
    sanitize('new_username'),
    catchExceptions(userController.updateUsername)
  );

  router.delete(
    '/:username',
    userIsAuth,
    catchExceptions(userController.delete)
  );
  
  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
