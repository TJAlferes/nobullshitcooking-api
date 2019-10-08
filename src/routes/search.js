const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const searchController = require('../controllers/search');

const router = Router();

// /v1/... ?

// for /search/...

router.post(
  '/autocomplete/all',
  catchExceptions(searchController.autocompletePublicAll)
);

router.post(
  '/find/all',
  catchExceptions(searchController.findPublicAll)
);



router.post(
  '/autocomplete/recipes',
  catchExceptions(searchController.autocompletePublicRecipes)
);

router.post(
  '/find/recipes',
  catchExceptions(searchController.findPublicRecipes)
);



router.post(
  '/autocomplete/ingredients',
  catchExceptions(searchController.autocompletePublicIngredients)
);

router.post(
  '/find/ingredients',
  catchExceptions(searchController.findPublicIngredients)
);

module.exports = router;