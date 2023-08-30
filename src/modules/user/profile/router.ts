import { Router } from 'express';
import { param }  from 'express-validator';

import { catchExceptions }   from '../../../utils';
import { profileController } from './controller';

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
