import { Router } from 'express';
import { body } from 'express-validator';

import {
  getSignedUrlContent
} from '../../../controllers/user/get-signed-url/content';
import { catchExceptions } from '../../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../../lib/utils/staffIsAuth';

export const router = Router();

// /v1/... ?

// for /staff/get-signed-url/content/...

router.post(
  '/',
  staffIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrlContent)
);