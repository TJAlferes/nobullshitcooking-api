import { Router } from 'express';
import { param }  from 'express-validator';

import { profileController } from './controller';
import { catchExceptions }   from '../../../utils';

const router = Router();

// for /profile/...

export function profileRouter() {
  router.get(
    '/:username',
    [param('username').not().isEmpty().trim().escape()],
    catchExceptions(profileController.view)
  );

  return router;
}
