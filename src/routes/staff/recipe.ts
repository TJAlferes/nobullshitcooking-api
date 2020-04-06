const { Router } = require('express');
import { body } from 'express-validator';

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffRecipeController = require('../../controllers/staff/recipe');

const router = Router();

// /v1/... ?

// for /staff/recipe/...

router.post(
  '/create',
  staffIsAuth,
  catchExceptions(staffRecipeController.createRecipe)
);

router.put(
  '/update',
  staffIsAuth,
  catchExceptions(staffRecipeController.updateRecipe)
);

router.delete(
  '/delete',
  staffIsAuth,
  catchExceptions(staffRecipeController.deleteRecipe)
);

module.exports = router;