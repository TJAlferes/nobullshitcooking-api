import { Router } from 'express';
import { body } from 'express-validator';

import { staffAuthController } from '../../controllers/staff/auth';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// /v1/... ?

// for /staff/auth/...

router.post(
  '/register',
  [
    body('email').not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape(),
    body('staffname').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffAuthController.register)
);

router.post(
  '/login',
  [
    body('email').not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffAuthController.login)
);

router.post(
  '/logout',
  staffIsAuth,
  catchExceptions(staffAuthController.logout)
);