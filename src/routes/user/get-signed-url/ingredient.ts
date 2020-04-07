import { Router } from 'express';

const userIsAuth = require('../../../lib/utils/userIsAuth');
const catchExceptions = require('../../../lib/utils/catchExceptions');
const getSignedUrlIngredient = require('../../../controllers/user/get-signed-url/ingredient');

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/ingredient/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(getSignedUrlIngredient)
);