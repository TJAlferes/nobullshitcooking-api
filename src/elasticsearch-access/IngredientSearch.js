class IngredientSearch {
  constructor(esClient) {
    this.client = esClient;
    //this.countFoundIngredients = this.countFoundIngredients.bind(this);
    this.findIngredients = this.findIngredients.bind(this);
    this.autoIngredients = this.autoIngredients.bind(this);
    this.saveIngredient = this.saveIngredient.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
  }

  /*async countFoundIngredients(query) {  // not even needed? body.hits.total.value?
    const res = await this.client.count({body: SimpleQueryStringBody(query)});  // change/finish
    return res.count;
  }*/

  async findIngredients(searchBody) {  // deep pagination can kill performance, set upper bounds 
    const { body } = await this.client.search({
      index: "ingredients",
      body: searchBody
    });
    return body;
  }

  async autoIngredients(searchTerm) {
    const { body } = await this.client.search({
      index: "ingredients",
      body: {
        highlight: {
          fragment_size: 200,  // less?
          number_of_fragments: 1,
          fields: {ingredientName: {}}
        },
        query: {
          bool: {
            must: [
              {
                match: {
                  ingredientName: {query: searchTerm, operator: "and"}
                }
              }
            ],
          }
        }
      },
      from: 0,
      size: 5
    });
    return body;
  }

  async saveIngredient(ingredientInfo) {
    const {
      ingredientId,
      ingredientTypeName,
      ingredientName,
      ingredientImage
    } = ingredientInfo;
    const savedIngredient = await this.client.index({
      index: 'ingredients',
      id: ingredientId,
      body: {
        ingredientId,
        ingredientTypeName,
        ingredientName,
        ingredientImage
      }
    });
    await this.client.indices.refresh({index: 'ingredients'});
    return savedIngredient;
  }

  async deleteIngredient(ingredientId) {
    const deletedIngredient = await this.client.delete(
      {index: 'ingredients', id: ingredientId},
      {ignore: [404]}
    );
    await this.client.indices.refresh({index: 'ingredients'});
    return deletedIngredient;
  }
}

module.exports = IngredientSearch;