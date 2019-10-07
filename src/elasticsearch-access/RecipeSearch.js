class RecipeSearch {
  constructor(esClient) {
    this.client = esClient;
    this.countFoundRecipes = this.countFoundRecipes.bind(this);
    this.findRecipes = this.findRecipes.bind(this);
    this.autoRecipes = this.autoRecipes.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  async countFoundRecipes(query) {  // not even needed? body.hits.total.value?
    const res = await this.client.count({body: SimpleQueryStringBody(query)});  // change/finish
    return res.count;
  }

  async findRecipes(searchBody) {  // deep pagination can kill performance, set upper bounds 
    const { body } = await this.client.search({
      index: "recipes",
      body: searchBody
    });
    console.log(body.hits.hits);
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
    const savedRecipe = await this.client.index({
      index: 'recipes',
      id: recipeId,
      //type: 'recipe',
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
    return savedRecipe;
  }

  async deleteRecipe(recipeId) {
    const deletedRecipe = await this.client.delete(
      {
        index: 'recipes',
        id: recipeId,
        //type: 'recipe'
      },
      {
        ignore: [404]
      }
    );
    await this.client.indices.refresh({index: 'recipes'});
    return deletedRecipe;
  }
}

module.exports = RecipeSearch;