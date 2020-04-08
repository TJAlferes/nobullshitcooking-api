import { Router } from 'express';
import { body } from 'express-validator';

import { userIsAuth } from '../../../lib/utils/userIsAuth';
import { catchExceptions } from '../../../lib/utils/catchExceptions';
import { getSignedUrlAvatar } from '../../../controllers/user/get-signed-url/avatar';

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/avatar/...

router.post(
  '/',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrlAvatar)
);