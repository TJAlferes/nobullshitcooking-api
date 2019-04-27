const pool = require('../data-access/dbPoolConnection');  // move?
const IngredientType = require('../data-access/IngredientType');

// object versus class?
const ingredientTypeController = {
  viewAllIngredientTypes: async function(req, res) {
    try {
      const ingredientType = new IngredientType(pool);
      const [ rows ] = await ingredientType.viewAllIngredientTypes();
      res.send(rows);
    } catch(err) {
      console.log(err);
    }
  },
  viewIngredientTypeById: async function(req, res) {
    try {
      const typeId = req.params.ingredientTypeId;  // sanitize and validate
      const ingredientType = new IngredientType(pool);
      const [ rows ] = await ingredientType.viewIngredientTypeById(typeId);
      res.send(rows);
    } catch(err) {
      console.log(err);
    }
  }
};

module.exports = ingredientTypeController;