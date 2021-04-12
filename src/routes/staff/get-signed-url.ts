import { Router } from 'express';
import { body } from 'express-validator';

import { getSignedUrl } from '../../controllers/user';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

const router = Router();

// for /staff/get-signed-url/...

export function staffGetSignedUrlRouter() {
  router.post(
    '/content',
    staffIsAuth,
    [body('fileType').not().isEmpty().trim().escape()],
    catchExceptions(getSignedUrl.content)
  );

  return router;
}