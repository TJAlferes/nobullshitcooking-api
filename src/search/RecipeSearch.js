const SimpleQueryStringBody = require('./SimpleQueryStringBody');

class RecipeSearch {
  constructor(client) {
    this.client = client;
    this.countFoundRecipes = this.countFoundRecipes.bind(this);
    this.findRecipes = this.findRecipes.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  async countFoundRecipes(userId, query) {
    const res = await this.client.count({
      body: SimpleQueryStringBody(userId, query)
    });
    return res.count;
  }

  async findRecipes(userId, query, starting, limit) {
    const { body } = await this.client.search({
      body: SimpleQueryStringBody(userId, query),
      sort: 'title:asc',
      from: starting,
      size: limit
    });
    return body.hits.hits;
  }

  saveRecipe(recipe) {
    const { recipeId, recipeTypeId, cuisineId, title, description } = recipe;
    return this.client.create({
      index: 'recipes',
      id: recipeId,
      type: 'recipe',
      body: {
        recipeId,
        recipeTypeId,
        cuisineId,
        title,
        description
      }
    });
  }

  deleteRecipe(recipeId) {
    return this.client.delete({
      ignore: [404],
      index: 'recipes',
      id: recipeId,
      type: 'recipe'
    });
  }
}

module.exports = RecipeSearch;