const express = require('express');

const recipeController = require('../controllers/recipe');

const router = express.Router();

// /v1/... ?
// catchExceptions()?

// for /recipes/...

router.post('/', recipeController.viewRecipes);
router.get('/:recipeId', recipeController.viewRecipeDetail);

module.exports = router;