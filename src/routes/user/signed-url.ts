import { Router } from 'express';
import { body }   from 'express-validator';

import { UserSignedUrlController as Controller } from '../../controllers/user';
import { catchExceptions, userIsAuth }           from '../../lib/utils';

const router = Router();

// for /user/signed-url

export function userSignedUrlRouter() {
  router.post('/', userIsAuth, [body('subBucket').not().isEmpty().trim().escape()], catchExceptions(Controller.s3RequestPresign));

  return router;
}
