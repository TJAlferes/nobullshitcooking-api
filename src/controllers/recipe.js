const pool = require('../data-access/dbPoolConnection');  // move?
const Recipe = require('../data-access/Recipe');
const validator = require('../lib/validations/recipe');

// object versus class?
const recipeController = {
  viewRecipe: async function(req, res, next) {  // split into three methods?
    try {
      // sanitize, validate
      const types = (req.body.types) ? req.body.types : [];
      const starting = (req.body.start) ? req.body.start : 0;
      const display = 25;
      const recipe = new Recipe(pool);

      // query all recipes of checked recipe types (multiple filters checked on frontend UI)
      if (types.length > 1) {
        let typeIds = [];
        for (i = 0; i < types.length; i++) {
          typeIds.push(types[i]);
        };
        const placeholders = '?, '.repeat(types.length - 1) + '?';
        const [ rows ] = await recipe.viewRecipesOfTypes(starting, display, placeholders, typeIds);
        const [ rowCount ] = await recipe.countRecipesOfTypes(placeholders, typeIds);
        // pagination (up to 25 recipes per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }

      // query all recipes of checked recipe type (one filter checked on frontend UI)
      if (types.length == 1) {
        let typeId = `${types}`;  // convert array element to string for SQL query
        const [ rows ] = await recipe.viewRecipesOfType(starting, display, typeId);
        const [ rowCount ] = await recipe.countRecipesOfType(typeId);
        // pagination (up to 25 recipes per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }

      // query all recipes (no filtration on frontend UI)
      if (types.length == 0) {
        const [ rows ] = await recipe.viewAllRecipes(starting, display);
        const [ rowCount ] = await recipe.countAllRecipes();
        // pagination (up to 25 recipes per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }

      next();
    } catch(err) {
      next(err);
    }
  },
  viewRecipeDetail: async function(req, res, next) {
    try {
      const recipeId = req.params.id;  // sanitize and validate
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.viewRecipeById(recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = recipeController;