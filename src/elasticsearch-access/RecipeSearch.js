class RecipeSearch {
  constructor(esClient) {
    this.client = esClient;
    this.findRecipes = this.findRecipes.bind(this);
    this.autoRecipes = this.autoRecipes.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  async findRecipes(searchBody) {  // deep pagination can kill performance, set upper bounds 
    const { body } = await this.client.search({
      index: "recipes",
      body: searchBody
    });
    return body;
  }

  async autoRecipes(searchTerm) {
    const { body } = await this.client.search({
      index: "recipes",
      body: {
        highlight: {
          fragment_size: 200,  // less?
          number_of_fragments: 1,
          fields: {title: {}}
        },
        //_source: ["title"],
        //aggs: {},
        query: {
          bool: {
            must: [
              {
                match: {
                  title: {query: searchTerm, operator: "and"}
                }
              }
            ],
            //...(filter && {filter})
          }
        }
      },
      from: 0,
      size: 5
    });
    return body;
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
    await this.client.index({
      index: 'recipes',
      id: recipeId,
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
    await this.client.indices.refresh({index: 'recipes'});
  }

  async deleteRecipe(recipeId) {
    await this.client.delete(
      {index: 'recipes', id: recipeId},
      {ignore: [404]}
    );
    await this.client.indices.refresh({index: 'recipes'});
  }
}

module.exports = RecipeSearch;