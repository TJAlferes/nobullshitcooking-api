import { Client } from '@elastic/elasticsearch';

interface SaveIngredient {
  ingredientId: string
  ingredientTypeName: string
  ingredientName: string
  ingredientImage: string
}

export class IngredientSearch {
  client: Client;

  constructor(esClient: Client) {
    this.client = esClient;
    this.findIngredients = this.findIngredients.bind(this);
    this.autoIngredients = this.autoIngredients.bind(this);
    this.saveIngredient = this.saveIngredient.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
  }

  async findIngredients(searchBody: object) {  // deep pagination can kill performance, set upper bounds 
    const { body } = await this.client.search({
      index: "ingredients",
      body: searchBody
    });
    return body;
  }

  async autoIngredients(searchTerm: string) {
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

  // (staff only)
  async saveIngredient({
    ingredientId,
    ingredientTypeName,
    ingredientName,
    ingredientImage
  }: SaveIngredient) {
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

  // (staff only)
  async deleteIngredient(ingredientId: string) {
    const deletedIngredient = await this.client.delete(
      {index: 'ingredients', id: ingredientId},
      {ignore: [404]}
    );
    await this.client.indices.refresh({index: 'ingredients'});
    return deletedIngredient;
  }
}