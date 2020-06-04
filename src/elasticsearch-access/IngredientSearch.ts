import { Client } from '@elastic/elasticsearch';

export class IngredientSearch implements IIngredientSearch {
  client: Client;

  constructor(esClient: Client) {
    this.client = esClient;
    this.findIngredients = this.findIngredients.bind(this);
    this.autoIngredients = this.autoIngredients.bind(this);
    this.saveIngredient = this.saveIngredient.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
  }

  // deep pagination can kill performance, set upper bounds 
  async findIngredients(searchBody: any) {
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
    ingredient_id,
    ingredient_type_name,
    ingredient_name,
    ingredient_image
  }: ISavingIngredient) {
    const savedIngredient = await this.client.index({
      index: 'ingredients',
      id: ingredient_id,
      body: {
        ingredient_id,
        ingredient_type_name,
        ingredient_name,
        ingredient_image
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

interface IIngredientSearch {
  client: Client;
  findIngredients(searchBody: any): any;  // finish
  autoIngredients(searchTerm: string): any;  // finish
  saveIngredient({
    ingredient_id,
    ingredient_type_name,
    ingredient_name,
    ingredient_image
  }: ISavingIngredient): void;
  deleteIngredient(ingredientId: string): void;
}

interface ISavingIngredient {
  ingredient_id: string;
  ingredient_type_name: string;
  ingredient_name: string;
  ingredient_image: string;
}