import { Router } from 'express';
import { body } from 'express-validator';

import { staffRecipeController } from '../../controllers/staff/recipe';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// /v1/... ?

// for /staff/recipe/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('recipeTypeId').not().isEmpty().trim().escape(),
    body('cuisineId').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('directions').not().isEmpty().trim().escape(),
    body('recipeImage').not().isEmpty().trim().escape(),
    body('recipeEquipmentImage').not().isEmpty().trim().escape(),
    body('recipeIngredientsImage').not().isEmpty().trim().escape(),
    body('recipeCookingImage').not().isEmpty().trim().escape(),
    body('ownership').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffRecipeController.createRecipe)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('recipeId').not().isEmpty().trim().escape(),
    body('recipeTypeId').not().isEmpty().trim().escape(),
    body('cuisineId').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('directions').not().isEmpty().trim().escape(),
    body('recipeImage').not().isEmpty().trim().escape(),
    body('recipeEquipmentImage').not().isEmpty().trim().escape(),
    body('recipeIngredientsImage').not().isEmpty().trim().escape(),
    body('recipeCookingImage').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffRecipeController.updateRecipe)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('recipeId').not().isEmpty().trim().escape()],
  catchExceptions(staffRecipeController.deleteRecipe)
);