const SimpleQueryStringBody = require('./SimpleQueryStringBody');

// set up initial settings and analyzers including n-gram
// remember you need two modules on front end: searchbar and searchpage

class RecipeSearch {
  constructor(client) {
    this.client = client;
    this.countFoundRecipes = this.countFoundRecipes.bind(this);
    this.findRecipes = this.findRecipes.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  async countFoundRecipes(query) {
    const res = await this.client.count({body: SimpleQueryStringBody(query)});
    return res.count;
  }

  async findRecipes(query, starting, limit) {
    const { body } = await this.client.search({
      body: SimpleQueryStringBody(query),
      sort: 'title:asc',
      from: starting,
      size: limit
    });
    return body.hits.hits;
  }

  async saveRecipe(recipeInfo) {
    const {
      recipeId,
      authorName,
      recipeTypeName,
      cuisineName,
      title,
      description,
      recipeImage,
      methodNames,
      equipmentNames,
      ingredientNames,
      subrecipeNames
    } = recipeInfo;
    const savedRecipe = await this.client.index({
      index: 'recipes',
      id: recipeId,
      type: 'recipe',
      body: {
        recipeId,
        authorName,
        recipeTypeName,
        cuisineName,
        title,
        description,
        recipeImage,
        methodNames,
        equipmentNames,
        ingredientNames,
        subrecipeNames
      }
    });
    return savedRecipe;
  }

  async deleteRecipe(recipeId) {
    const deletedRecipe = await this.client.delete({
      ignore: [404],
      index: 'recipes',
      id: recipeId,
      type: 'recipe'
    });
    return deletedRecipe;
  }
}

module.exports = RecipeSearch;