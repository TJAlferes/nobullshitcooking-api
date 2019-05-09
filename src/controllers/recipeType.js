const pool = require('../data-access/dbPoolConnection');  // move?
const RecipeType = require('../data-access/RecipeType');

// object versus class?
const recipeTypeController = {
  viewAllRecipeTypes: async function(req, res, next) {
    try {
      const recipeType = new RecipeType(pool);
      const [ rows ] = await recipeType.viewAllRecipeTypes();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewRecipeTypeById: async function(req, res, next) {
    try {
      const typeId = req.params.id;  // sanitize and validate
      const recipeType = new RecipeType(pool);
      const [ rows ] = await recipeType.viewRecipeTypeById(typeId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = recipeTypeController;