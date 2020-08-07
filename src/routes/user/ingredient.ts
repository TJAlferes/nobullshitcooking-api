import { Router } from 'express';
import { body } from 'express-validator';

import { userIngredientController } from '../../controllers/user/ingredient';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// /v1/... ?

// for /user/ingredient/...

router.post(
  '/all',
  userIsAuth,
  catchExceptions(userIngredientController.view)
);

router.post(
  '/one',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userIngredientController.viewById)
);

router.post(
  '/create',
  userIsAuth,
  [
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('brand').not().isEmpty().trim().escape(),
    body('variety').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ],
  catchExceptions(userIngredientController.create)
);

router.put(
  '/update',
  userIsAuth,
  [
    body('id').not().isEmpty().trim().escape(),
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('brand').not().isEmpty().trim().escape(),
    body('variety').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ],
  catchExceptions(userIngredientController.update)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userIngredientController.delete)
);