const express = require('express');

const ingredientController = require('../controllers/ingredient');

const router = express.Router();

// /v1/... ?
// catchExceptions()?

// for /ingredient/...

router.post('/', ingredientController.viewIngredients);
router.get('/:ingredientId', ingredientController.viewIngredientDetail);

module.exports = router;