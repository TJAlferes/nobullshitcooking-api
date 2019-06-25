const pool = require('../data-access/dbPoolConnection');  // move?
const Cuisine = require('../data-access/Cuisine');
const validCuisineRequest = require('../lib/validations/cuisineRequest');

const cuisineController = {
  viewAllCuisines: async function(req, res, next) {
    try {
      const cuisine = new Cuisine(pool);
      const rows = await cuisine.viewAllCuisines();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewCuisineById: async function(req, res, next) {
    try {
      const cuisineId = req.sanitize(req.params.cuisineId);
      validCuisineRequest({cuisineId}); //if (cuisineId < 1 || cuisineId > 12) throw new Error('invalid cuisine');
      const cuisine = new Cuisine(pool);
      const [ row ] = await cuisine.viewCuisineById(cuisineId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = cuisineController;