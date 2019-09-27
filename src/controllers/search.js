const esClient = require('../lib/connections/elasticsearchClient');
const RecipeSearch = require('../elasticsearch-access/RecipeSearch');
//const validation(s)

const searchController = {
  searchPublicRecipes: async function(req, res) {
    const q = "Coffee";
    const starting = 1;
    const limit = 12;
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.findRecipes(q, starting, limit);
    console.log(found);
    return res.json({found});
  }
};

module.exports = searchController;