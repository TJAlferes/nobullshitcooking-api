import { Router } from 'express';

const userIsAuth = require('../../../lib/utils/userIsAuth');
const catchExceptions = require('../../../lib/utils/catchExceptions');
const getSignedUrlAvatar = require('../../../controllers/user/get-signed-url/avatar');

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/avatar/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(getSignedUrlAvatar)
);