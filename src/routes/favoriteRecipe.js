const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const favoriteRecipeController = require('../controllers/favoriteRecipe');

const router = Router();

// /v1/... ?

// for /favorite-recipe/...

router.get(
  '/',
  catchExceptions(favoriteRecipeController.viewMostFavorited)
);

module.exports = router;