import { Router } from 'express';

const catchExceptions = require('../lib/utils/catchExceptions');
const favoriteRecipeController = require('../controllers/favoriteRecipe');

export const router = Router();

// /v1/... ?

// for /favorite-recipe/...

router.get(
  '/',
  catchExceptions(favoriteRecipeController.viewMostFavorited)
);