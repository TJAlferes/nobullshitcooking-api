import { Router } from 'express';
import { param } from 'express-validator';

import { userProfileController } from '../../controllers/user/profile';
import { catchExceptions } from '../../lib/utils/catchExceptions';

export const router = Router();

// /v1/... ?

// for /user/profile/...

router.get(
  '/:username',
  [param('username').not().isEmpty().trim().escape()],
  catchExceptions(userProfileController.viewProfile)
);