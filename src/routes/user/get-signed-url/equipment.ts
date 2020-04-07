import { Router } from 'express';

const userIsAuth = require('../../../lib/utils/userIsAuth');
const catchExceptions = require('../../../lib/utils/catchExceptions');
const getSignedUrlEquipment = require('../../../controllers/user/get-signed-url/equipment');

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/equipment/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(getSignedUrlEquipment)
);