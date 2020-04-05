const { Router } = require('express');

const catchExceptions = require('../../lib/utils/catchExceptions');
const userProfileController = require('../../controllers/user/profile');

const router = Router();

// /v1/... ?

// for /user/profile/...

router.get(
  '/:username',
  catchExceptions(userProfileController.viewProfile)
);

module.exports = router;