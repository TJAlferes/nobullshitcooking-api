import { Client } from '@elastic/elasticsearch';

export class RecipeSearch implements IRecipeSearch {
  client: Client;

  constructor(esClient: Client) {
    this.client = esClient;
    this.find = this.find.bind(this);
    this.auto = this.auto.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
  }

  // deep pagination can kill performance, set upper bounds 
  async find(searchBody: any) {
    const { body } =
      await this.client.search({index: "recipes", body: searchBody});
    return body;
  }

  async auto(searchTerm: string) {
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

  async save({
    id,
    author,
    recipe_type_name,
    cuisine_name,
    title,
    description,
    directions,
    recipe_image,
    method_names,
    equipment_names,
    ingredient_names,
    subrecipe_titles
  }: ISavingRecipe) {
    await this.client.index({
      index: 'recipes',
      id,
      body: {
        id,
        author,
        recipe_type_name,
        cuisine_name,
        title,
        description,
        directions,
        recipe_image,
        method_names,
        equipment_names,
        ingredient_names,
        subrecipe_titles
      }
    });
    await this.client.indices.refresh({index: 'recipes'});
  }

  async delete(id: string) {
    await this.client.delete({index: 'recipes', id}, {ignore: [404]});
    await this.client.indices.refresh({index: 'recipes'});
  }
}

interface IRecipeSearch {
  client: Client;
  find(searchBody: any): any;  // finish
  auto(searchTerm: string): any;  // finish
  save({
    id,
    author,
    recipe_type_name,
    cuisine_name,
    title,
    description,
    directions,
    recipe_image,
    method_names,
    equipment_names,
    ingredient_names,
    subrecipe_titles
  }: ISavingRecipe): void;
  delete(recipeId: string): void;
}

interface ISavingRecipe {
  id: string;
  author: string;
  recipe_type_name: string;
  cuisine_name: string;
  title: string;
  description: string;
  directions: string;
  recipe_image: string;
  method_names: string[];
  equipment_names: string[];
  ingredient_names: string[];
  subrecipe_titles: string[];
}