import { Router } from 'express';
import { body } from 'express-validator';

import { staffIngredientController } from '../../controllers/staff/ingredient';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// for /staff/ingredient/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('brand').not().isEmpty().trim().escape(),
    body('variety').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffIngredientController.create)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('id').not().isEmpty().trim().escape(),
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('brand').not().isEmpty().trim().escape(),
    body('variety').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffIngredientController.update)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(staffIngredientController.delete)
);