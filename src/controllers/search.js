const esClient = require('../lib/connections/elasticsearchClient');
const AllSearch = require('../elasticsearch-access/AllSearch');
const RecipeSearch = require('../elasticsearch-access/RecipeSearch');
const IngredientSearch = require('../elasticsearch-access/IngredientSearch');

const searchController = {
  autocompletePublicAll: async function(req, res) {
    const searchTerm = req.sanitize(req.body.searchTerm);
    const allSearch = new AllSearch(esClient);
    const found = await allSearch.autoAll(searchTerm);
    return res.json({found});
  },
  findPublicAll: async function(req, res) {
    const body = req.body.body;  // TO DO: on front end, buildRequest, body (searchBody) needs to be changed depending on prefilter
    const allSearch = new AllSearch(esClient);
    const found = await allSearch.findAll(body);
    return res.json({found});
  },

  autocompletePublicRecipes: async function(req, res) {
    const searchTerm = req.sanitize(req.body.searchTerm);
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.autoRecipes(searchTerm);
    return res.json({found});
  },
  findPublicRecipes: async function(req, res) {
    const body = req.body.body;  // TO DO: on front end, buildRequest, body (searchBody) needs to be changed depending on prefilter
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.findRecipes(body);
    return res.json({found});
  },

  autocompletePublicIngredients: async function(req, res) {
    const searchTerm = req.sanitize(req.body.searchTerm);
    const ingredientSearch = new IngredientSearch(esClient);
    const found = await ingredientSearch.autoIngredients(searchTerm);
    return res.json({found});
  },
  findPublicIngredients: async function(req, res) {
    const body = req.body.body;  // TO DO: on front end, buildRequest, body (searchBody) needs to be changed depending on prefilter
    const ingredientSearch = new IngredientSearch(esClient);
    const found = await ingredientSearch.findIngredients(body);
    return res.json({found});
  }
};

module.exports = searchController;