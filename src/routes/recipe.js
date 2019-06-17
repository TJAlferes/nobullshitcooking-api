const { Router } = require('express');

const pool = require('../data-access/dbPoolConnection');
//const Recipe = require('../data-access/Recipe');
const catchExceptions = require('../lib/utils/catchExceptions');
const recipeController = require('../controllers/recipe');

const router = Router();

// /v1/... ?

// for /recipe/...

router.get(
  '/submit-edit-form',
  catchExceptions(async function(req, res, next) {
    try {
      const sql = `
        SELECT recipe_id, recipe_type_id, cuisine_id, title
        FROM nobsc_recipes
        ORDER BY title ASC
      `;
      const [ rows ] = await pool.execute(sql);
      console.log('rows in recipe controller: ', rows);
      res.send(rows);
    } catch(err) {
      next(err);
    }
  })
);

router.post(
  '/',
  catchExceptions(recipeController.viewRecipe)
);

router.get(
  '/:recipeId',
  catchExceptions(recipeController.viewRecipeDetail)
);

// YOU CAN REMOVE THIS NOW
router.post(
  '/titles',
  catchExceptions(recipeController.viewRecipeTitlesByIds)
);

module.exports = router;