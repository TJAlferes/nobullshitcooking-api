const pool = require('../data-access/dbPoolConnection');  // move?
const Recipe = require('../data-access/Recipe');
const validator = require('../lib/validations/recipe');

const recipeController = {
  viewRecipe: async function(req, res, next) {  // split into three methods?
    try {
      // sanitize, validate
      const types = (req.body.types) ? req.body.types : [];
      const cuisines = (req.body.cuisines) ? req.body.cuisines : [];
      const starting = (req.body.start) ? req.body.start : 0;
      const display = 25;
      const recipe = new Recipe(pool);

      // maybe it's time to switch to graphql...

      // query all recipes of checked recipe types (multiple recipe type filters checked on frontend UI)
      if (types.length > 1) {
        let typeIds = [];
        for (i = 0; i < types.length; i++) {
          typeIds.push(types[i]);
        };
        const placeholders = '?, '.repeat(types.length - 1) + '?';
        const [ rows ] = await recipe.viewRecipesOfTypes(starting, display, placeholders, typeIds);
        const [ rowCount ] = await recipe.countRecipesOfTypes(placeholders, typeIds);
        
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      // query all recipes of checked recipe type (one recipe type filter checked on frontend UI)
      if (types.length == 1) {
        let typeId = `${types}`;  // convert array element to string for SQL query
        const [ rows ] = await recipe.viewRecipesOfType(starting, display, typeId);
        const [ rowCount ] = await recipe.countRecipesOfType(typeId);
        
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      // query all recipes (no recipe type filtration on frontend UI)
      if (types.length == 0) {
        const [ rows ] = await recipe.viewAllRecipes(starting, display);
        const [ rowCount ] = await recipe.countAllRecipes();
        
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      



      if (cuisines.length > 1) {
        let cuisineIds = [];
        for (i = 0; i < cuisines.length; i++) {
          cuisineIds.push(cuisines[i]);
        };
        const cuisinePlaceholders = '?, '.repeat(cuisines.length - 1) + '?';
        if (types.length > 1) {
          const [ rows ] = await recipe.viewRecipesOfCuisinesAndTypes();
        }
        if (types.length == 1) {
          const [ rows ] = await recipe.viewRecipesOfCuisinesAndType();
        }
        if (types.length == 0) {
          const [ rows ] = await recipe.viewRecipesOfCuisines(starting, display, cuisinePlaceholders, cuisineIds);
          const [ rowCount ] = await recipe.countRecipesOfCuisines(cuisinePlaceholders, cuisineIds);
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          res.send({rows, pages, starting});
        }
      }

      if (cuisines.length == 1) {
        let cuisineId = `${cuisines}`;  // convert array element to string for SQL query
        if (types.length > 1) {
          const [ rows ] = await recipe.viewRecipesOfCuisineAndTypes();
        }
        if (types.length == 1) {
          const [ rows ] = await recipe.viewRecipesOfCuisineAndType();
        }
        if (types.length == 0) {
          const [ rows ] = await recipe.viewRecipesOfCuisine(starting, display, cuisineId);
          const [ rowCount ] = await recipe.countRecipesOfCuisine(cuisineId);
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          res.send({rows, pages, starting});
        }
      }

      if (cuisines.length == 0) {
        if (types.length > 1) {
          const [ rows ] = await recipe.viewRecipesOfTypes();
        }
        if (types.length == 1) {
          const [ rows ] = await recipe.viewRecipesOfType();
        }
        if (types.length == 0) {
          const [ rows ] = await recipe.viewAllRecipes(starting, display);
          const [ rowCount ] = await recipe.countAllRecipes();
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          res.send({rows, pages, starting});
        }
      }

      next();
    } catch(err) {
      next(err);
    }
  },
  viewRecipeDetail: async function(req, res, next) {
    try {
      const recipeId = req.params.recipeId;
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