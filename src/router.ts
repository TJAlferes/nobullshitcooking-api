import { Router } from 'express';
import { body } from 'express-validator';

import { AwsS3PrivateUploadsController } from './modules/aws-s3/private-uploads/controller';
import { AwsS3PublicUploadsController } from './modules/aws-s3/public-uploads/controller';
import { initialDataController } from './modules/initial-data/controller';
import { userAuthenticationController } from './modules/user/authentication/controller';
/*import { chatgroupUserRouter } from './modules/chat/group/user/router';
import { chatgroupRouter } from './modules/chat/group/router';
//import { chatmessageRouter } from './modules/chat/router';
//import { chatroomUserRouter } from './modules/chat/room/user/router';
import { chatroomRouter } from './modules/chat/room/router';
//import { chatUserRouter } from './modules/chat/user/router';
//import { chatRouter } from './modules/chat/router';*/
import { equipmentTypeRouter } from './modules/equipment/type/router';
import { equipmentRouter } from './modules/equipment/router';
import { ingredientTypeRouter } from './modules/ingredient/type/router';
import { ingredientRouter } from './modules/ingredient/router';
import { cuisineRouter } from './modules/recipe/cuisine/router';
import { methodRouter } from './modules/recipe/method/router';
import { recipeTypeRouter } from './modules/recipe/type/router';
import { recipeRouter } from './modules/recipe/router';
import { searchRouter } from './modules/search/router';
import { unitRouter } from './modules/shared/unit/router';
import { userRouter } from './modules/user/router';
import { profileController } from './modules/user/profile/controller';
import { catchExceptions, userIsAuth } from './utils/index';

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
    '/forgot-password',
    sanitize(['email']),
    catchExceptions(userAuthenticationController.forgotPassword)
  );

  router.patch(
    '/reset-password',
    sanitize(['email', 'temporary_password', 'new_password']),
    catchExceptions(userAuthenticationController.resetPassword)
  );

  // TO DO: move ???
  
  router.post(
    '/aws-s3-private-uploads',
    userIsAuth,
    sanitize('subfolder'),
    catchExceptions(AwsS3PrivateUploadsController.signUrlToUploadImage)
  );

  router.get(
    '/aws-s3-private-uploads/many',
    userIsAuth,
    sanitize('access_requests.*.*'),
    catchExceptions(AwsS3PrivateUploadsController.signUrlToViewImages)
  );

  router.get(
    '/aws-s3-private-uploads/one',
    userIsAuth,
    sanitize(['subfolder', 'image_filename', 'size']),
    catchExceptions(AwsS3PrivateUploadsController.signUrlToViewImage)
  );

  router.post(
    '/aws-s3-public-uploads',
    userIsAuth,
    sanitize(['subfolder', 'image_filename', 'size']),
    catchExceptions(AwsS3PublicUploadsController.signUrlToUploadImage)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
