const pool = require('../data-access/dbPoolConnection');  // move?
const IngredientType = require('../data-access/IngredientType');
const validIngredientTypeRequest = require('../lib/validations/ingredientTypeRequest');

const ingredientTypeController = {
  viewAllIngredientTypes: async function(req, res, next) {
    try {
      const ingredientType = new IngredientType(pool);
      const rows = await ingredientType.viewAllIngredientTypes();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewIngredientTypeById: async function(req, res, next) {
    try {
      const ingredientTypeId = req.sanitize(req.params.ingredientTypeId);
      validIngredientTypeRequest({ingredientTypeId});
      //if (ingredientTypeId < 1 || ingredientTypeId > 18) throw new Error('invalid ingredient type');
      const ingredientType = new IngredientType(pool);
      const [ row ] = await ingredientType.viewIngredientTypeById(ingredientTypeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = ingredientTypeController;