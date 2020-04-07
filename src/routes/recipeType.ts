import { Router } from 'express';

const catchExceptions = require('../lib/utils/catchExceptions');
const recipeTypeController = require('../controllers/recipeType');

export const router = Router();

// /v1/... ?

// for /recipe-type/...

router.get(
  '/',
  catchExceptions(recipeTypeController.viewAllRecipeTypes)
);

router.get(
  '/:recipeTypeId',
  catchExceptions(recipeTypeController.viewRecipeTypeById)
);