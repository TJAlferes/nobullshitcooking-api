import { Router } from 'express';
import { param } from 'express-validator';

const catchExceptions = require('../../lib/utils/catchExceptions');
const userProfileController = require('../../controllers/user/profile');

export const router = Router();

// /v1/... ?

// for /user/profile/...

router.get(
  '/:username',
  [param('username').not().isEmpty().trim().escape()],
  catchExceptions(userProfileController.viewProfile)
);