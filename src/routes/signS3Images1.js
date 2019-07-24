const { Router } = require('express');

const userIsAuth = require('../lib/utils/userIsAuth');
const catchExceptions = require('../lib/utils/catchExceptions');
const signS3Images1 = require('../controllers/signS3Images1');

const router = Router();

// /v1/... ?

// for /sign-s3-images-1/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(signS3Images1)
);

module.exports = router;