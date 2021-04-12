import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { ProfileController } from '../controllers';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /profile/...

export function profileRouter(pool: Pool) {
  const controller = new ProfileController(pool);

  router.get(
    '/:username',
    [param('username').not().isEmpty().trim().escape()],
    catchExceptions(controller.view)
  );

  return router;
}