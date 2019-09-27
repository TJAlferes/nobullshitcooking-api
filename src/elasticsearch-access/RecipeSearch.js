//const SimpleQueryStringBody = require('./SimpleQueryStringBody');

// set up initial settings and analyzers including n-gram
// remember you need two modules on front end: searchbar and searchpage

class RecipeSearch {
  constructor(esClient) {
    this.client = esClient;
    this.countFoundRecipes = this.countFoundRecipes.bind(this);
    this.findRecipes = this.findRecipes.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  async countFoundRecipes(query) {
    const res = await this.client.count({body: SimpleQueryStringBody(query)});
    return res.count;
  }

  async findRecipes(q, starting, limit) {  // deep pagination can kill performance, set upper bounds
    const { body } = await this.client.search({
      body: {
        query: {
          match: {
            title: {query: q, operator: "and"}
          }
        }
      },
      //sort: 'title:asc',  // no no
      from: starting,
      size: limit
    });
    console.log('body: ', body);
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
      directions,
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
        directions,
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
    const deletedRecipe = await this.client.delete(
      {
        index: 'recipes',
        id: recipeId,
        type: 'recipe'
      },
      {
        ignore: [404]
      }
    );
    return deletedRecipe;
  }
}

module.exports = RecipeSearch;