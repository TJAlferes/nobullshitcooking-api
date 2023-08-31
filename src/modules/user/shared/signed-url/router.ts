import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth }           from '../../../../utils';
import { userSignedUrlController as controller } from './controller';

const router = Router();

// for /user/signed-url

export function userSignedUrlRouter() {
  router.post(
    '/',
    userIsAuth,
    body(['folder', 'filname']).not().isEmpty().trim().escape(),
    catchExceptions(controller.s3RequestPresign)
  );

  return router;
}
