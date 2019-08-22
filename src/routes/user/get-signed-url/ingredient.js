const { Router } = require('express');

const userIsAuth = require('../../../lib/utils/userIsAuth');
const catchExceptions = require('../../../lib/utils/catchExceptions');
const getSignedUrlIngredient = require('../../../controllers/user/get-signed-url/ingredient');

const router = Router();

// /v1/... ?

// for /user/get-signed-url/ingredient/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(getSignedUrlIngredient)
);

module.exports = router;