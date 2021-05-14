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

  async auto(term: string) {
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
        query: {bool: {
          must: [{match: {title: {query: term, operator: "and"}}}],
          //...(filter && {filter})
        }}
      },
      from: 0,
      size: 5
    });
    return body;
  }

  async save(recipe: ISavingRecipe) {
    const row = await this.client.index({
      index: 'recipes',
      id: recipe.id,
      body: {
        id: recipe.id,
        author: recipe.author,
        recipe_type_name: recipe.recipe_type_name,
        cuisine_name: recipe.cuisine_name,
        title: recipe.title,
        description: recipe.description,
        directions: recipe.directions,
        recipe_image: recipe.recipe_image,
        method_names: recipe.method_names,
        equipment_names: recipe.equipment_names,
        ingredient_names: recipe.ingredient_names,
        subrecipe_titles: recipe.subrecipe_titles
      }
    });
    await this.client.indices.refresh({index: 'recipes'});
    return row;
  }

  async delete(id: string) {
    const row =
      await this.client.delete({index: 'recipes', id}, {ignore: [404]});
    await this.client.indices.refresh({index: 'recipes'});
    return row;
  }
}

export interface IRecipeSearch {
  client: Client;
  find(searchBody: any): any;  // finish
  auto(term: string): any;  // finish
  save(recipe: ISavingRecipe): void;
  delete(id: string): void;
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