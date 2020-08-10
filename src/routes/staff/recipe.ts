import { Router } from 'express';
import { body } from 'express-validator';

import { staffRecipeController } from '../../controllers/staff/recipe';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// for /staff/recipe/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('recipeTypeId').not().isEmpty().trim().escape(),
    body('cuisineId').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('activeTime').not().isEmpty().trim().escape(),
    body('totalTime').not().isEmpty().trim().escape(),
    body('directions').not().isEmpty().trim().escape(),
    body('recipeImage').not().isEmpty().trim().escape(),
    body('equipmentImage').not().isEmpty().trim().escape(),
    body('ingredientsImage').not().isEmpty().trim().escape(),
    body('cookingImage').not().isEmpty().trim().escape(),
    body('ownership').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffRecipeController.create)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('id').not().isEmpty().trim().escape(),
    body('recipeTypeId').not().isEmpty().trim().escape(),
    body('cuisineId').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('activeTime').not().isEmpty().trim().escape(),
    body('totalTime').not().isEmpty().trim().escape(),
    body('directions').not().isEmpty().trim().escape(),
    body('recipeImage').not().isEmpty().trim().escape(),
    body('equipmentImage').not().isEmpty().trim().escape(),
    body('ingredientsImage').not().isEmpty().trim().escape(),
    body('cookingImage').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffRecipeController.update)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(staffRecipeController.delete)
);