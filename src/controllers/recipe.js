const pool = require('../data-access/dbPoolConnection');  // move?
const Recipe = require('../data-access/Recipe');
const validator = require('../lib/validations/recipe');

const recipeController = {
  viewRecipe: async function(req, res, next) {
    try {
      // sanitize, validate
      const types = (req.body.types) ? req.body.types : [];
      const cuisines = (req.body.cuisines) ? req.body.cuisines : [];
      const starting = (req.body.start) ? req.body.start : 0;
      const display = 25;
      const recipe = new Recipe(pool);

      // maybe it's time to switch to graphql...

      // unit test this

      // --------------------------------------------------

      if (cuisines.length > 1) {

        //let cuisineIds = [];
        //for (i = 0; i < cuisines.length; i++) cuisineIds.push(cuisines[i]);
        const cuisinePlaceholders = '?, '.repeat(cuisines.length - 1) + '?';

        if (types.length > 1) {
          //let typeIds = [];
          //for (i = 0; i < types.length; i++) typeIds.push(types[i]);
          let ids = cuisines.concat(types);
          const typePlaceholders = '?, '.repeat(types.length - 1) + '?';
          const [ rows ] = await recipe.viewRecipesOfCuisinesAndTypes(
            starting, display, cuisinePlaceholders, typePlaceholders, ids
          );
          const [ rowCount ] = await recipe.countRecipesOfCuisinesAndTypes(
            cuisinePlaceholders, typePlaceholders, ids
          );
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          return res.send({rows, pages, starting});
        }

        if (types.length == 1) {
          //let typeId = `${types}`;
          let ids = cuisines.concat(types);
          const [ rows ] = await recipe.viewRecipesOfCuisinesAndType(
            starting, display, cuisinePlaceholders, ids
          );
          const [ rowCount ] = await recipe.countRecipesOfCuisinesAndType(
            cuisinePlaceholders, ids
          );
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          return res.send({rows, pages, starting});
        }

        if (types.length == 0) {
          const [ rows ] = await recipe.viewRecipesOfCuisines(
            starting, display, cuisinePlaceholders, cuisines
          );
          const [ rowCount ] = await recipe.countRecipesOfCuisines(
            cuisinePlaceholders, cuisines
          );
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          return res.send({rows, pages, starting});
        }

      }

      // --------------------------------------------------

      if (cuisines.length == 1) {

        //let cuisineId = `${cuisines}`;

        if (types.length > 1) {
          //let typeIds = [];
          //for (i = 0; i < types.length; i++) typeIds.push(types[i]);
          let ids = cuisines.concat(types);
          const typePlaceholders = '?, '.repeat(types.length - 1) + '?';
          const [ rows ] = await recipe.viewRecipesOfCuisineAndTypes(
            starting, display, typePlaceholders, ids
          );
          const [ rowCount ] = await recipe.countRecipesOfCuisineAndTypes(
            typePlaceholders, ids
          );
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          return res.send({rows, pages, starting});
        }

        if (types.length == 1) {
          //let typeId = `${types}`;
          let ids = cuisines.concat(types);
          const [ rows ] = await recipe.viewRecipesOfCuisineAndType(
            starting, display, ids
          );
          const [ rowCount ] = await recipe.countRecipesOfCuisineAndType(ids);
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          return res.send({rows, pages, starting});
        }

        if (types.length == 0) {
          let cuisineId = `${cuisines}`;
          const [ rows ] = await recipe.viewRecipesOfCuisine(
            starting, display, cuisineId
          );
          const [ rowCount ] = await recipe.countRecipesOfCuisine(cuisineId);
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          return res.send({rows, pages, starting});
        }

      }

      // --------------------------------------------------

      if (cuisines.length == 0) {

        if (types.length > 1) {
          //let typeIds = [];
          //for (i = 0; i < types.length; i++) typeIds.push(types[i]);
          const typePlaceholders = '?, '.repeat(types.length - 1) + '?';
          const [ rows ] = await recipe.viewRecipesOfTypes(
            starting, display, typePlaceholders, types
          );
          const [ rowCount ] = await recipe.countRecipesOfTypes(
            typePlaceholders, types
          );
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          return res.send({rows, pages, starting});
        }

        if (types.length == 1) {
          let typeId = `${types}`;
          const [ rows ] = await recipe.viewRecipesOfType(starting, display, typeId);
          const [ rowCount ] = await recipe.countRecipesOfType(typeId);
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          return res.send({rows, pages, starting});
        }

        if (types.length == 0) {
          const [ rows ] = await recipe.viewAllRecipes(starting, display);
          const [ rowCount ] = await recipe.countAllRecipes();
          let total = rowCount[0].total;
          let pages = (total > display) ? Math.ceil(total / display) : 1;
          return res.send({rows, pages, starting});
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