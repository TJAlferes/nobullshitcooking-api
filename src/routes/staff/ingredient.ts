const { Router } = require('express');
import { body } from 'express-validator';

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffIngredientController = require('../../controllers/staff/ingredient');

const router = Router();

// /v1/... ?

// for /staff/ingredient/...

router.post(
  '/create',
  staffIsAuth,
  catchExceptions(staffIngredientController.createIngredient)
);

router.put(
  '/update',
  staffIsAuth,
  catchExceptions(staffIngredientController.updateIngredient)
);

router.delete(
  '/delete',
  staffIsAuth,
  catchExceptions(staffIngredientController.deleteIngredient)
);

module.exports = router;