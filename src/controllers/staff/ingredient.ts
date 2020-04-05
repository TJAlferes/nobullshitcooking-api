const pool = require('../../lib/connections/mysqlPoolConnection');
const esClient = require('../../lib/connections/elasticsearchClient');

const Ingredient = require('../../mysql-access/Ingredient');

const IngredientSearch = require('../../elasticsearch-access/IngredientSearch');

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

    const createdIngredient = await ingredient
    .createIngredient(ingredientToCreate);

    const generatedId = createdIngredient.insertId;

    const [ ingredientForInsert ] = await ingredient
    .getIngredientForElasticSearchInsert(generatedId, ownerId);

    const ingredientInfo = {
      ingredientId: ingredientForInsert[0].ingredientId,
      ingredientTypeName: ingredientForInsert[0].ingredientTypeName,
      ingredientName: ingredientForInsert[0].ingredientName,
      ingredientImage: ingredientForInsert[0].ingredientImage
    };

    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.saveIngredient(ingredientInfo);

    res.send({message: 'Ingredient created.'});
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

    await ingredient.updateIngredient(ingredientToUpdateWith, ingredientId);

    const [ ingredientForInsert ] = await ingredient
    .getIngredientForElasticSearchInsert(ingredientId, ownerId);

    const ingredientInfo = {
      ingredientId: ingredientForInsert[0].ingredientId,
      ingredientTypeName: ingredientForInsert[0].ingredientTypeName,
      ingredientName: ingredientForInsert[0].ingredientName,
      ingredientImage: ingredientForInsert[0].ingredientImage
    };

    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.saveIngredient(ingredientInfo);

    res.send({message: 'Ingredient updated.'});
  },
  deleteIngredient: async function(req, res) {
    const ingredientId = Number(req.sanitize(req.body.ingredientId));

    const ingredient = new Ingredient(pool);
    await ingredient.deleteIngredient(ingredientId);

    const ingredientSearch = new IngredientSearch(esClient);
    await ingredientSearch.deleteIngredient(ingredientId);

    res.send({message: 'Ingredient deleted.'});
  }
};

module.exports = staffIngredientController;