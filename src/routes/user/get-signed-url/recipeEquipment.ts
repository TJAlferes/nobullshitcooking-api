import { Router } from 'express';
import { body } from 'express-validator';

import { userIsAuth } from '../../../lib/utils/userIsAuth';
import { catchExceptions } from '../../../lib/utils/catchExceptions';
import { getSignedUrlRecipeEquipment } from '../../../controllers/user/get-signed-url/recipeEquipment';

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/recipe-equipment/...

router.post(
  '/',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrlRecipeEquipment)
);