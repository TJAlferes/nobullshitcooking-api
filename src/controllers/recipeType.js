const pool = require('../lib/connections/mysqlPoolConnection');
const RecipeType = require('../mysql-access/RecipeType');
const validRecipeTypeRequest = require('../lib/validations/recipeType/recipeTypeRequest');

const recipeTypeController = {
  viewAllRecipeTypes: async function(req, res, next) {
    try {
      const recipeType = new RecipeType(pool);
      const rows = await recipeType.viewAllRecipeTypes();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewRecipeTypeById: async function(req, res, next) {
    try {
      const recipeTypeId = Number(req.sanitize(req.params.recipeTypeId));
      validRecipeTypeRequest({recipeTypeId});
      //if (recipeTypeId < 1 || recipeTypeId > 12) throw new Error('invalid recipe type');
      const recipeType = new RecipeType(pool);
      const [ row ] = await recipeType.viewRecipeTypeById(recipeTypeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = recipeTypeController;