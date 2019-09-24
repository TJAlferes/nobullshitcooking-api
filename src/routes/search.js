const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const searchController = require('../controllers/search');

const router = Router();

// /v1/... ?

// for /search/...

router.post(
  '/recipes',
  catchExceptions(searchController.searchPublicRecipes)
);

router.get(
  '/recipes',
  catchExceptions(searchController.searchPublicRecipes)
);

module.exports = router;