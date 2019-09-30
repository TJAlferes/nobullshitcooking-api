const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const searchController = require('../controllers/search');

const router = Router();

// /v1/... ?

// for /search/...

router.post(
  '/autocomplete/recipes',
  catchExceptions(searchController.autocompletePublicRecipes)
);

router.post(
  '/find/recipes',
  catchExceptions(searchController.findPublicRecipes)
);

module.exports = router;