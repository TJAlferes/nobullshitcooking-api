import { Router } from 'express';
import { body } from 'express-validator';

import {
  getSignedUrlContent
} from '../../../controllers/user/get-signed-url/content';
import { catchExceptions } from '../../../lib/utils/catchExceptions';
import { userIsAuth } from '../../../lib/utils/userIsAuth';

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/content/...

router.post(
  '/',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrlContent)
);