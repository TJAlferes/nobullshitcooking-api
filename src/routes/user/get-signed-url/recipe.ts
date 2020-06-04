import { Router } from 'express';
import { body } from 'express-validator';

import {
  getSignedUrlRecipe
} from '../../../controllers/user/get-signed-url/recipe';
import { catchExceptions } from '../../../lib/utils/catchExceptions';
import { userIsAuth } from '../../../lib/utils/userIsAuth';

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/recipe/...

router.post(
  '/',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrlRecipe)
);