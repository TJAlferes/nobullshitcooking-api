import { Router } from 'express';

const userIsAuth = require('../../../lib/utils/userIsAuth');
const catchExceptions = require('../../../lib/utils/catchExceptions');
const getSignedUrlRecipeEquipment = require('../../../controllers/user/get-signed-url/recipeEquipment');

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/recipe-equipment/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(getSignedUrlRecipeEquipment)
);