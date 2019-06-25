const pool = require('../../data-access/dbPoolConnection');
const Ingredient = require('../../data-access/Ingredient');
const validIngredientEntity = require('../../lib/validations/staff/ingredientEntity');

const staffIngredientController = {
  createIngredient: async function(req, res, next) {
    try {
      const ingredientTypeId = req.sanitize(req.body.ingredientInfo.ingredientTypeId);
      const ingredientName = req.sanitize(req.body.ingredientInfo.ingredientName);
      const ingredientDescription = req.sanitize(req.body.ingredientInfo.ingredientDescription);
      const ingredientImage = req.sanitize(req.body.ingredientInfo.ingredientImage);

      const ingredient = new Ingredient(pool);

      const ingredientToCreate = validIngredientEntity({
        ingredientTypeId,
        ingredientName,
        ingredientDescription,
        ingredientImage
      });
      const [ row ] = await ingredient.createIngredient(ingredientToCreate);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateIngredient: async function(req, res, next) {
    try {
      const ingredientTypeId = req.sanitize(req.body.ingredientInfo.ingredientTypeId);
      const ingredientName = req.sanitize(req.body.ingredientInfo.ingredientName);
      const ingredientDescription = req.sanitize(req.body.ingredientInfo.ingredientDescription);
      const ingredientImage = req.sanitize(req.body.ingredientInfo.ingredientImage);

      const ingredient = new Ingredient(pool);

      const ingredientToUpdate = validIngredientEntity({
        ingredientTypeId,
        ingredientName,
        ingredientDescription,
        ingredientImage
      });
      const [ row ] = await ingredient.updateIngredient(ingredientToUpdate);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteIngredient: async function(req, res, next) {
    try {
      const ingredientId = req.body.ingredientId;  // sanitize and validate?
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.deleteIngredient(ingredientId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = staffIngredientController;