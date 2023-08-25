import { Router } from 'express';
import { body }   from 'express-validator';

import { userSignedUrlController as controller } from './controller';
import { catchExceptions, userIsAuth }           from '../../../../utils';

const router = Router();

// for /user/signed-url

export function userSignedUrlRouter() {
  router.post(
    '/',
    userIsAuth,
    body('folder').not().isEmpty().trim().escape(),
    catchExceptions(controller.s3RequestPresign)
  );

  return router;
}
