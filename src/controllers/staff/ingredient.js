const pool = require('../../lib/connections/mysqlPoolConnection');
const Ingredient = require('../../mysql-access/Ingredient');
const validIngredientEntity = require('../../lib/validations/ingredient/ingredientEntity');

const staffIngredientController = {
  createIngredient: async function(req, res) {
    const ingredientTypeId = Number(req.sanitize(req.body.ingredientInfo.ingredientTypeId));
    const ingredientName = req.sanitize(req.body.ingredientInfo.ingredientName);
    const ingredientDescription = req.sanitize(req.body.ingredientInfo.ingredientDescription);
    const ingredientImage = req.sanitize(req.body.ingredientInfo.ingredientImage);

    const authorId = 1;
    const ownerId = 1;

    const ingredientToCreate = validIngredientEntity({
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    });
    const ingredient = new Ingredient(pool);
    const [ row ] = await ingredient.createIngredient(ingredientToCreate);

    // TO DO: ElasticSearch

    res.send(row);
  },
  updateIngredient: async function(req, res) {
    const ingredientId = Number(req.sanitize(req.body.ingredientInfo.ingredientId));
    const ingredientTypeId = Number(req.sanitize(req.body.ingredientInfo.ingredientTypeId));
    const ingredientName = req.sanitize(req.body.ingredientInfo.ingredientName);
    const ingredientDescription = req.sanitize(req.body.ingredientInfo.ingredientDescription);
    const ingredientImage = req.sanitize(req.body.ingredientInfo.ingredientImage);

    const authorId = 1;
    const ownerId = 1;

    const ingredientToUpdateWith = validIngredientEntity({
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    });
    const ingredient = new Ingredient(pool);
    const [ row ] = await ingredient.updateIngredient(ingredientToUpdateWith, ingredientId);

    // TO DO: ElasticSearch

    res.send(row);
  },
  deleteIngredient: async function(req, res) {
    const ingredientId = Number(req.sanitize(req.body.ingredientId));
    const ingredient = new Ingredient(pool);
    const [ row ] = await ingredient.deleteIngredient(ingredientId);

    // TO DO: ElasticSearch

    res.send(row);
  }
};

module.exports = staffIngredientController;