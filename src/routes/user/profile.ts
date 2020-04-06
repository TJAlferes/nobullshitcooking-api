const { Router } = require('express');
import { body } from 'express-validator';

const catchExceptions = require('../../lib/utils/catchExceptions');
const userProfileController = require('../../controllers/user/profile');

const router = Router();

// /v1/... ?

// for /user/profile/...

router.get(
  '/:username',
  [param('username').not().isEmpty().trim().escape()],
  catchExceptions(userProfileController.viewProfile)
);

module.exports = router;