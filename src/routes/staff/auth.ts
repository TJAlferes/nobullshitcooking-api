import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { StaffAuthController } from '../../controllers/staff';
import { catchExceptions, staffIsAuth } from '../../lib/utils';

const router = Router();

// for /staff/auth/...

export function staffAuthRouter(pool: Pool) {
  const controller = new StaffAuthController(pool);

  router.post('/register', [
    body('email').not().isEmpty().trim().escape(),
    body('pass').not().isEmpty().trim().escape(),
    body('staffname').not().isEmpty().trim().escape()
  ], catchExceptions(controller.register));

  router.post('/resend-confirmation-code', [
    body('email').not().isEmpty().trim().escape(),
    body('pass').not().isEmpty().trim().escape()
  ], catchExceptions(controller.resendConfirmationCode));

  router.post('/verify', [
    body('email').not().isEmpty().trim().escape(),
    body('pass').not().isEmpty().trim().escape(),
    body('confirmationCode').not().isEmpty().trim().escape()
  ], catchExceptions(controller.verify));
  
  router.post('/login', [
    body('email').not().isEmpty().trim().escape(),
    body('pass').not().isEmpty().trim().escape()
  ], catchExceptions(controller.login));
  
  router.post('/logout', staffIsAuth, catchExceptions(controller.logout));

  // why POST?
  router.post('/update', staffIsAuth, [
    body('email').not().isEmpty().trim().escape(),
    body('pass').not().isEmpty().trim().escape(),
    body('username').not().isEmpty().trim().escape()
  ], catchExceptions(controller.update));

  return router;
}