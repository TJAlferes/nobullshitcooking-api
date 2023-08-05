import { Router } from 'express';
import { param }  from 'express-validator';

import { ProfileController } from '../controllers';
import { catchExceptions }   from '../lib/utils';

const router = Router();

// for /profile/...

export function profileRouter() {
  const controller = new ProfileController();

  router.get('/:username', [param('username').not().isEmpty().trim().escape()], catchExceptions(controller.view));

  return router;
}