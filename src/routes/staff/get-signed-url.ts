import { Router } from 'express';
import { body } from 'express-validator';

import { getSignedUrl } from '../../controllers/user/get-signed-url';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// for /staff/get-signed-url/...

router.post(
  '/content',
  staffIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrl.content)
);