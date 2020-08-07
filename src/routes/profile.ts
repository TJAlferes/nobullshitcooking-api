import { Router } from 'express';
import { param } from 'express-validator';

import { profileController } from '../controllers/profile';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /profile/...

router.get(
  '/:username',
  [param('username').not().isEmpty().trim().escape()],
  catchExceptions(profileController.view)
);