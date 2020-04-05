const { Router } = require('express');

const userIsAuth = require('../../../lib/utils/userIsAuth');
const catchExceptions = require('../../../lib/utils/catchExceptions');
const getSignedUrlRecipeCooking = require('../../../controllers/user/get-signed-url/recipeCooking');

const router = Router();

// /v1/... ?

// for /user/get-signed-url/recipe-cooking/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(getSignedUrlRecipeCooking)
);

module.exports = router;