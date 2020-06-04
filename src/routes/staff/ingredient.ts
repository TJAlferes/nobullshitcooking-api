import { Router } from 'express';
import { body } from 'express-validator';

import { staffIngredientController } from '../../controllers/staff/ingredient';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// /v1/... ?

// for /staff/ingredient/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('ingredientName').not().isEmpty().trim().escape(),
    body('ingredientDescription').not().isEmpty().trim().escape(),
    body('ingredientImage').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffIngredientController.createIngredient)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('ingredientId').not().isEmpty().trim().escape(),
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('ingredientName').not().isEmpty().trim().escape(),
    body('ingredientDescription').not().isEmpty().trim().escape(),
    body('ingredientImage').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffIngredientController.updateIngredient)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('ingredientId').not().isEmpty().trim().escape()],
  catchExceptions(staffIngredientController.deleteIngredient)
);