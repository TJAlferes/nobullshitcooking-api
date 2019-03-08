const express = require('express');
//const { body } = require('express-validator/check');

const userRecipeController = require('../../controllers/user/recipe');
const userIsAuth = require('../../lib/utils/userIsAuth');

const router = express.Router();
//const isValid = [];

// /v1/... ?
// catchExceptions()?

// for /user/recipe/...

router.post('/create', userIsAuth, /*isValid,*/ userRecipeController.createRecipe);

router.get('/recipes', userRecipeController.viewRecipes);
router.get('/:recipeId', userRecipeController.viewRecipe);

router.put('/edit/:recipeId', userIsAuth, /*isValid,*/ userRecipeController.updateRecipe);

router.delete('/delete/:recipeId', userIsAuth, userRecipeController.deleteRecipe);

module.exports = router;