const pool = require('../../lib/connections/mysqlPoolConnection');
const RecipeIngredient = require('../../mysql-access/RecipeIngredient');
const Ingredient = require('../../mysql-access/Ingredient');
const validIngredientEntity = require('../../lib/validations/ingredient/ingredientEntity');

const userIngredientController = {
  viewAllMyPrivateUserIngredients: async function(req, res) {
    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;
    const ingredient = new Ingredient(pool);
    const rows = await ingredient.viewIngredients(authorId, ownerId);
    res.send(rows);
  },
  viewMyPrivateUserIngredient: async function(req, res) {
    const ingredientId = Number(req.body.ingredientId);
    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;
    const ingredient = new Ingredient(pool);
    const [ row ] = await ingredient.viewIngredientById(ingredientId, authorId, ownerId);
    res.send(row);
  },
  createMyPrivateUserIngredient: async function(req, res) {
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const ingredientName = req.body.ingredientInfo.ingredientName;
    const ingredientDescription = req.body.ingredientInfo.ingredientDescription;
    const ingredientImage = req.body.ingredientInfo.ingredientImage;

    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;

    const ingredientToCreate = validIngredientEntity({
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    });
    const ingredient = new Ingredient(pool);
    await ingredient.createMyPrivateUserIngredient(ingredientToCreate);
    res.send({message: 'Ingredient created.'});
  },
  updateMyPrivateUserIngredient: async function(req, res) {
    const ingredientId = Number(req.body.ingredientInfo.ingredientId);
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const ingredientName = req.body.ingredientInfo.ingredientName;
    const ingredientDescription = req.body.ingredientInfo.ingredientDescription;
    const ingredientImage = req.body.ingredientInfo.ingredientImage;

    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;

    const ingredientToUpdateWith = validIngredientEntity({
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    });
    const ingredient = new Ingredient(pool);
    await ingredient.updateMyPrivateUserIngredient(ingredientToUpdateWith, ingredientId);
    res.send({message: 'Ingredient updated.'});
  },
  deleteMyPrivateUserIngredient: async function(req, res) {
    const ingredientId = Number(req.body.ingredientId);
    const ownerId = req.session.userInfo.userId;
    const recipeIngredient = new RecipeIngredient(pool);
    const ingredient = new Ingredient(pool);
    await recipeIngredient.deleteRecipeIngredientsByIngredientId(ingredientId);
    await ingredient.deleteMyPrivateUserIngredient(ownerId, ingredientId);
    res.send({message: 'Ingredient deleted.'});
  }
};

module.exports = userIngredientController;