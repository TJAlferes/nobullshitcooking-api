const esClient = require('../lib/connections/elasticsearchClient');
const RecipeSearch = require('../elasticsearch-access/RecipeSearch');
//const validation(s)

const searchController = {
  searchPublicRecipes: async function(req, res) {
    //const q;
    //const starting;
    //const limit;
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.findRecipes(q, starting, limit);
    return res.json({found});
  }
};

module.exports = searchController;