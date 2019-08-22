const { Router } = require('express');

const userIsAuth = require('../../../lib/utils/userIsAuth');
const catchExceptions = require('../../../lib/utils/catchExceptions');
const getSignedUrlRecipeIngredients = require('../../../controllers/user/get-signed-url/recipeIngredients');

const router = Router();

// /v1/... ?

// for /user/get-signed-url/recipe-ingredients/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(getSignedUrlRecipeIngredients)
);

module.exports = router;