const pool = require('../data-access/dbPoolConnection');  // move?
const IngredientType = require('../data-access/IngredientType');

// object versus class?
const ingredientTypeController = {
  viewAllIngredientTypes: async function(req, res, next) {
    try {
      const ingredientType = new IngredientType(pool);
      const [ rows ] = await ingredientType.viewAllIngredientTypes();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewIngredientTypeById: async function(req, res, next) {
    try {
      const typeId = req.params.ingredientTypeId;  // sanitize and validate
      const ingredientType = new IngredientType(pool);
      const [ rows ] = await ingredientType.viewIngredientTypeById(typeId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = ingredientTypeController;