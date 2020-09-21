import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { StaffAuthController } from '../../controllers/staff/auth';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

const router = Router();

// for /staff/auth/...

export function staffAuthRouter(pool: Pool) {
  const controller = new StaffAuthController(pool);

  router.post(
    '/register',
    [
      body('email').not().isEmpty().trim().escape(),
      body('password').not().isEmpty().trim().escape(),
      body('staffname').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.register)
  );
  
  router.post(
    '/login',
    [
      body('email').not().isEmpty().trim().escape(),
      body('password').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.login)
  );
  
  router.post(
    '/logout',
    staffIsAuth,
    catchExceptions(controller.logout)
  );

  return router;
}