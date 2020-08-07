import { Router } from 'express';
import { body } from 'express-validator';

import { getSignedUrl } from '../../controllers/user/get-signed-url';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/...

router.post(
  '/avatar',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrl.avatar)
);

router.post(
  '/content',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrl.content)
);

router.post(
  '/equipment',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrl.equipment)
);

router.post(
  '/ingredient',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrl.ingredient)
);

router.post(
  '/recipe',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrl.recipe)
);

router.post(
  '/recipe-cooking',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrl.recipeCooking)
);

router.post(
  '/recipe-equipment',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrl.recipeEquipment)
);

router.post(
  '/recipe-ingredients',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrl.recipeIngredients)
);