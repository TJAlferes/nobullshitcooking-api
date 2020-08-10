import { Router } from 'express';
import { body } from 'express-validator';

import { userRecipeController } from '../../controllers/user/recipe';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// for /user/recipe/...

router.post(
  '/create',
  userIsAuth,
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
  catchExceptions(userRecipeController.create)
);

router.put(
  '/update',
  userIsAuth,
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
    body('cookingImage').not().isEmpty().trim().escape(),
    body('ownership').not().isEmpty().trim().escape()
  ],
  catchExceptions(userRecipeController.update)
);

router.delete(
  '/delete/private',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.deletePrivateById)
);

router.delete(
  '/disown/public',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.disownById)
);  // TO DO: change to router.put

router.post(
  '/private/all',
  userIsAuth,
  catchExceptions(userRecipeController.viewPrivate)
);

router.post(
  '/public/all',
  userIsAuth,
  catchExceptions(userRecipeController.viewPublic)
);

router.post(
  '/private/one',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.viewPrivateById)
);

router.post(
  '/public/one',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.viewPublicById)
);

router.post(
  '/edit/private',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.getInfoToEditPrivate)
);

router.post(
  '/edit/public',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userRecipeController.getInfoToEditPublic)
);