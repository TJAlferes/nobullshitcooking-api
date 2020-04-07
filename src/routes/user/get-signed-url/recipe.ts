import { Router } from 'express';

const userIsAuth = require('../../../lib/utils/userIsAuth');
const catchExceptions = require('../../../lib/utils/catchExceptions');
const getSignedUrlRecipe = require('../../../controllers/user/get-signed-url/recipe');

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/recipe/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(getSignedUrlRecipe)
);