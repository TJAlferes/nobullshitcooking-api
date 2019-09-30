const esClient = require('../lib/connections/elasticsearchClient');
const RecipeSearch = require('../elasticsearch-access/RecipeSearch');
//const validation(s)

const searchController = {
  autocompletePublicRecipes: async function(req, res) {
    const query = req.sanitize(req.body.searchTerm);  // validate
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.autoRecipes(query);
    return res.json({found});
  },
  findPublicRecipes: async function(req, res) {
    const query = req.sanitize(req.body.searchTerm);  // validate
    const starting = Number(req.sanitize(req.body.starting));  // validate
    const limit = Number(req.sanitize(req.body.limit));  // validate
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.findRecipes(query, starting, limit);
    return res.json({found});
  }
};

module.exports = searchController;