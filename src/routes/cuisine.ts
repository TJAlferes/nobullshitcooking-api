import { Router } from 'express';
import { param } from 'express-validator';

const catchExceptions = require('../lib/utils/catchExceptions');
const cuisineController = require('../controllers/cuisine');

export const router = Router();

// /v1/... ?

// for /cuisine/...

router.get(
  '/',
  catchExceptions(cuisineController.viewAllCuisines)
);

router.get(
  '/detail/:cuisineId',
  [param('cuisineId').not().isEmpty().trim().escape()],
  catchExceptions(cuisineController.viewCuisineDetailById)
);

router.get(
  '/:cuisineId',
  [param('cuisineId').not().isEmpty().trim().escape()],
  catchExceptions(cuisineController.viewCuisineById)
);