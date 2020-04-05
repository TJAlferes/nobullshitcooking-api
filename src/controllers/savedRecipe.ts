const pool = require('../lib/connections/mysqlPoolConnection');
const SavedRecipe = require('../mysql-access/SavedRecipe');

const savedRecipeController = {
  viewMostSaved: async function(req, res) {
    const limit = req.body.limit; // no. change.
    const savedRecipe = new SavedRecipe(pool);
    const rows = await savedRecipe.viewMostSaved(limit);
    res.send(rows);
  }
};

module.exports = savedRecipeController;