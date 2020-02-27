const pool = require('../../lib/connections/mysqlPoolConnection');

const CuisineIngredient = require('../../mysql-access/CuisineIngredient');

const staffCuisineIngredientController = {
  createCuisineIngredient: async function(req, res) {
    const ingredientId = Number(req.sanitize(req.body.ingredientId));

    const cuisineIngredient = new CuisineIngredient(pool);

    await cuisineIngredient.createCuisineIngredient(ingredientId);

    res.send({message: 'Cuisine ingredient created.'});
  },

  deleteCuisineIngredient: async function(req, res) {
    const cuisineId = Number(req.sanitize(req.body.cuisineId));
    const ingredientId = Number(req.sanitize(req.body.ingredientId));

    const cuisineIngredient = new CuisineIngredient(pool);

    await cuisineIngredient.deleteCuisineIngredient(cuisineId, ingredientId);

    res.send({message: 'Cuisine ingredient deleted.'});
  }
};

module.exports = staffCuisineIngredientController;