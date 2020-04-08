import { Router } from 'express';
import { body } from 'express-validator';

import { userIsAuth } from '../../../lib/utils/userIsAuth';
import { catchExceptions } from '../../../lib/utils/catchExceptions';
import { getSignedUrlRecipe } from '../../../controllers/user/get-signed-url/recipe';

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/recipe/...

router.post(
  '/',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrlRecipe)
);