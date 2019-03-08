const express = require('express');
//const { body } = require('express-validator/check');

const staffRecipeController = require('../../controllers/staff/recipe');
const staffIsAuth = require('../../lib/utils/staffIsAuth');

const router = express.Router();
//const isValid = [];

// /v1/... ?
// catchExceptions()?

// for /staff/recipe/...

router.post('/create', staffIsAuth, /*isValid,*/ staffRecipeController.createRecipe);

router.put('/edit/:recipeId', staffIsAuth, /*isValid,*/ staffRecipeController.updateRecipe);

router.delete('/delete/:recipeId', staffIsAuth, staffRecipeController.deleteRecipe);

module.exports = router;