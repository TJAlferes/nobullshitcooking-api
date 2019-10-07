const esClient = require('../lib/connections/elasticsearchClient');
const RecipeSearch = require('../elasticsearch-access/RecipeSearch');

const searchController = {
  autocompletePublicRecipes: async function(req, res) {
    const searchTerm = req.sanitize(req.body.searchTerm);  // TO DO: prefilters
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.autoRecipes(searchTerm);
    return res.json({found});
  },
  findPublicRecipes: async function(req, res) {
    const body = req.body.body;
    console.log(body);
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.findRecipes(body);
    return res.json({found});
  }
};

module.exports = searchController;