import { Router } from 'express';
import { body }   from 'express-validator';

import { UserSignedUrlController as Controller } from './controller';
import { catchExceptions, userIsAuth }           from '../../../utils';

const router = Router();

// for /user/signed-url

export function userSignedUrlRouter() {
  router.post(
    '/',
    userIsAuth,
    body('folder').not().isEmpty().trim().escape(),
    catchExceptions(Controller.s3RequestPresign)
  );

  return router;
}
