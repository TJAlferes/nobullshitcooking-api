import { Router } from 'express';
import { body }   from 'express-validator';

import { AWSS3Controller } from './modules/aws-s3/controller.js';
import { initialDataController } from './modules/initial-data/controller.js';
import { userAuthenticationController } from './modules/user/authentication/controller.js';
/*import { chatgroupUserRouter } from './modules/chat/group/user/router.js';
import { chatgroupRouter } from './modules/chat/group/router.js';
//import { chatmessageRouter } from './modules/chat/router.js';
//import { chatroomUserRouter } from './modules/chat/room/user/router.js';
import { chatroomRouter } from './modules/chat/room/router.js';
//import { chatUserRouter } from './modules/chat/user/router.js';
//import { chatRouter } from './modules/chat/router.js';*/
import { equipmentTypeRouter } from './modules/equipment/type/router.js';
import { equipmentRouter } from './modules/equipment/router.js';
import { ingredientTypeRouter } from './modules/ingredient/type/router.js';
import { ingredientRouter } from './modules/ingredient/router.js';
import { cuisineRouter } from './modules/recipe/cuisine/router.js';
import { methodRouter } from './modules/recipe/method/router.js';
import { recipeTypeRouter } from './modules/recipe/type/router.js';
import { recipeRouter } from './modules/recipe/router.js';
import { searchRouter } from './modules/search/router.js';
import { unitRouter } from './modules/shared/unit/router.js';
import { userRouter } from './modules/user/router.js';
import { profileController } from './modules/user/profile/controller.js';
import { catchExceptions, userIsAuth } from './utils/index.js';

const router = Router();

export function apiV1Router() {
  router.use('/search', searchRouter());
  router.use('/cuisines', cuisineRouter());
  router.use('/equipments', equipmentRouter());
  router.use('/equipment-types', equipmentTypeRouter());
  router.use('/ingredients', ingredientRouter());
  router.use('/ingredient-types', ingredientTypeRouter());
  router.use('/units', unitRouter());
  router.use('/methods', methodRouter());
  router.use('/recipes', recipeRouter());
  router.use('/recipe-types', recipeTypeRouter());
  //router.use('/chatgroups', chatgroupRouter());
  //router.use('/chatrooms', chatroomRouter());
  //router.use('/chatmessages', chatmessageRouter());
  router.use('/users', userRouter());

  router.get(
    '/initial-data',
    catchExceptions(initialDataController.view)
  );

  router.get(
    '/:username',
    catchExceptions(profileController.view)
  );

  router.get(
    '/',
    (req, res) => res.send(`
      No Bullshit Cooking API
      Documentation at https://github.com/tjalferes/nobullshitcooking-api
    `)
  );

  router.post(
    '/confirm',
    sanitize(['confirmation_code']),
    catchExceptions(userAuthenticationController.confirm)
  );

  router.post(
    '/resend-confirmation-code',
    sanitize(['email', 'password']),
    catchExceptions(userAuthenticationController.resendConfirmationCode)
  );

  router.post(
    '/login',
    sanitize(['email', 'password']),
    catchExceptions(userAuthenticationController.login)
  );

  router.post(
    '/logout',
    userIsAuth,
    catchExceptions(userAuthenticationController.logout)
  );

  router.post(
    '/signed-url',
    userIsAuth,
    sanitize('subfolder'),
    catchExceptions(AWSS3Controller.createPresignedUrl)
  );
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
