const pool = require('../lib/connections/mysqlPoolConnection');
const SavedRecipe = require('../mysql-access/SavedRecipe');

const savedRecipeController = {
  viewMostSaved: async function(req, res, next) {
    try {
      const limit = req.body.limit;
      const savedRecipe = new SavedRecipe(pool);
      const rows = await savedRecipe.viewMostSaved(limit);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = savedRecipeController;