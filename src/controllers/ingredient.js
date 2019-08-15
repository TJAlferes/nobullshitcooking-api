const pool = require('../lib/connections/mysqlPoolConnection');
const Ingredient = require('../mysql-access/Ingredient');
const validIngredientsRequest = require('../lib/validations/ingredient/ingredientsRequest');
const validIngredientRequest = require('../lib/validations/ingredient/ingredientRequest');

const ingredientController = {
  viewIngredient: async function(req, res, next) {  // split into three methods?
    try {
      console.log('ingredientController.viewIngredient called');
      const types = (req.body.types) ? req.body.types : [];
      const starting = (req.body.start) ? Number(req.sanitize(req.body.start)) : 0;
      const display = 25;  // to do: allow user on FE to change this
      validIngredientsRequest({types, starting, display});

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
  viewAllOfficialIngredients: async function (res, res) {
    const ingredient = new Ingredient(pool);
    const rows = ingredient.viewAllOfficialIngredients();
    res.send(rows);
  },
  viewIngredientDetail: async function(req, res, next) {
    try {
      const ingredientId = Number(req.sanitize(req.params.ingredientId));
      validIngredientRequest({ingredientId});
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.viewIngredientById(ingredientId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewIngredientsForSubmitEditForm: async function(req, res, next) {
    try {
      const ingredient = new Ingredient(pool);
      const rows = await ingredient.viewIngredientsForSubmitEditForm();
      res.send(rows);
    } catch(err) {
      next(err);
    }
  }
};

module.exports = ingredientController;