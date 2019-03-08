const pool = require('../data-access/dbPoolConnection');  // move?
const RecipeType = require('../data-access/RecipeType');

// object versus class?
const recipeTypeController = {
  viewAllRecipeTypes: async function(req, res) {
    try {
      const recipeType = new RecipeType(pool);
      const [ rows ] = await recipeType.viewAllRecipeTypes();
      res.send(rows);
    } catch(err) {
      console.log(err);
    }
  },
  viewRecipeTypeById: async function(req, res) {
    try {
      const typeId = req.params.id;  // sanitize and validate
      const recipeType = new RecipeType(pool);
      const [ rows ] = await recipeType.viewRecipeTypeById(typeId);
      res.send(rows);
    } catch(err) {
      console.log(err);
    }
  }
};

module.exports = recipeTypeController;