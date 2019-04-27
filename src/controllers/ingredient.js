const pool = require('../data-access/dbPoolConnection');  // move?
const Ingredient = require('../data-access/Ingredient');
const validator = require('../lib/validations/ingredient');

// object versus class?
const ingredientController = {
  viewIngredient: async function(req, res) {  // split into three methods?
    try {
      // sanitize, validate
      const types = (req.body.types) ? req.body.types : [];
      const starting = (req.body.start) ? req.body.start : 0;
      const display = 25;
      const ingredient = new Ingredient(pool);
      console.log(req.body);

      // query all ingredients of checked ingredient types (multiple filters checked on frontend UI)
      if (types.length > 1) {
        let typeIds = [];
        for (i = 0; i < types.length; i++) {
          typeIds.push(types[i]);
        };
        const placeholders = '?, '.repeat(types.length - 1) + '?';
        const [ rows ] = await ingredient.viewIngredientsOfTypes(starting, display, placeholders, typeIds);
        const [ rowCount ] = await ingredient.countIngredientsOfTypes(placeholders, typeIds);
        // pagination (up to 25 ingredients per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }

      // query all ingredients of checked ingredient type (one filter checked on frontend UI)
      if (types.length == 1) {
        let typeId = `${types}`;  // convert array element to string for SQL query
        const [ rows ] = await ingredient.viewIngredientsOfType(starting, display, typeId);
        const [ rowCount ] = await ingredient.countIngredientsOfType(typeId);
        // pagination (up to 25 ingredients per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }

      // query all ingredients (no filtration on frontend UI)
      if (types.length == 0) {
        const [ rows ] = await ingredient.viewAllIngredients(starting, display);
        console.log('hello' + starting + display);
        const [ rowCount ] = await ingredient.countAllIngredients();
        // pagination (up to 25 ingredients per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  viewIngredientDetail: async function(req, res) {
    try {
      const ingredientId = req.params.ingredientId;  // sanitize and validate
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.viewIngredientById(ingredientId);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  createIngredient: async function(req, res) {
    try {
      const ingredientInfo = req.body.ingredientInfo;  // sanitize and validate
      validator.validate(ingredientInfo);  // implement control flow here
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.createIngredient(ingredientInfo);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  updateIngredient: async function(req, res) {
    try {
      const ingredientInfo = req.body.ingredientInfo;  // sanitize and validate
      validator.validate(ingredientInfo);  // implement control flow here
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.createIngredient(ingredientInfo);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  deleteIngredient: async function(req, res) {
    try {
      const ingredientId = req.body.ingredientId;  // sanitize and validate
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.deleteIngredient(ingredientId);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  }
};

module.exports = ingredientController;