const pool = require('../data-access/dbPoolConnection');  // move?
const Ingredient = require('../data-access/Ingredient');
const validator = require('../lib/validations/ingredient');

const ingredientController = {
  viewIngredient: async function(req, res, next) {  // split into three methods?
    try {
      // sanitize, validate
      const types = (req.body.types) ? req.body.types : [];
      const starting = (req.body.start) ? req.body.start : 0;
      const display = 25;
      const ingredient = new Ingredient(pool);

      if (types.length > 1) {
        const placeholders = '?, '.repeat(types.length - 1) + '?';
        const rows = await ingredient.viewIngredientsOfTypes(starting, display, placeholders, types);
        const rowCount = await ingredient.countIngredientsOfTypes(placeholders, types);
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      if (types.length == 1) {
        let typeId = `${types}`;
        const rows = await ingredient.viewIngredientsOfType(starting, display, typeId);
        const rowCount = await ingredient.countIngredientsOfType(typeId);
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      if (types.length == 0) {
        const rows = await ingredient.viewAllIngredients(starting, display);
        const rowCount = await ingredient.countAllIngredients();
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      next();
    } catch(err) {
      next(err);
    }
  },
  viewIngredientDetail: async function(req, res, next) {
    try {
      const ingredientId = req.params.ingredientId;
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.viewIngredientById(ingredientId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = ingredientController;