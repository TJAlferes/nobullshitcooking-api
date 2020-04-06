const { Router } = require('express');
import { body } from 'express-validator';

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userRecipeController = require('../../controllers/user/recipe');

const router = Router();

// /v1/... ?

// for /user/recipe/...

router.post(
  '/create',
  userIsAuth,
  [
    body('recipeTypeId').not().isEmpty().trim().escape(),
    body('cuisineId').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('directions').not().isEmpty().trim().escape(),
    body('recipeImage').not().isEmpty().trim().escape(),
    body('equipmentImage').not().isEmpty().trim().escape(),
    body('ingredientsImage').not().isEmpty().trim().escape(),
    body('cookingImage').not().isEmpty().trim().escape(),
    body('ownership').not().isEmpty().trim().escape()
  ],
  catchExceptions(userRecipeController.createRecipe)
);

router.put(
  '/update',
  userIsAuth,
  [
    body('recipeId').not().isEmpty().trim().escape(),
    body('recipeTypeId').not().isEmpty().trim().escape(),
    body('cuisineId').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('directions').not().isEmpty().trim().escape(),
    body('recipeImage').not().isEmpty().trim().escape(),
    body('equipmentImage').not().isEmpty().trim().escape(),
    body('ingredientsImage').not().isEmpty().trim().escape(),
    body('cookingImage').not().isEmpty().trim().escape(),
    body('ownership').not().isEmpty().trim().escape()
  ],
  catchExceptions(userRecipeController.updateMyUserRecipe)
);

router.delete(
  '/delete/private',
  userIsAuth,
  [body('recipeId').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.deleteMyPrivateUserRecipe)
);

router.delete(
  '/disown/public',
  userIsAuth,
  [body('recipeId').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.disownMyPublicUserRecipe)
);  // change to router.put

router.post(
  '/private/all',
  userIsAuth,
  catchExceptions(userRecipeController.viewAllMyPrivateUserRecipes)
);

router.post(
  '/public/all',
  userIsAuth,
  catchExceptions(userRecipeController.viewAllMyPublicUserRecipes)
);

router.post(
  '/private/one',
  userIsAuth,
  [body('recipeId').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.viewMyPrivateUserRecipe)
);

router.post(
  '/public/one',
  userIsAuth,
  [body('recipeId').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.viewMyPublicUserRecipe)
);

router.post(
  '/edit/private',
  userIsAuth,
  [body('recipeId').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.getInfoToEditMyPrivateUserRecipe)
);

router.post(
  '/edit/public',
  userIsAuth,
  [body('recipeId').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.getInfoToEditMyPublicUserRecipe)
);

module.exports = router;