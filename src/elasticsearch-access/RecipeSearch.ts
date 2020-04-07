import { Client } from '@elastic/elasticsearch';

interface SaveRecipe {
  recipe_id: string
  author: string
  recipe_type_name: string
  cuisine_name: string
  title: string
  description: string
  directions: string
  recipe_image: string
  method_names: string[]
  equipment_names: string[]
  ingredient_names: string[]
  subrecipe_titles: string[]
}

export class RecipeSearch {
  client: Client;

  constructor(esClient: Client) {
    this.client = esClient;
    this.findRecipes = this.findRecipes.bind(this);
    this.autoRecipes = this.autoRecipes.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  async findRecipes(searchBody: object) {  // deep pagination can kill performance, set upper bounds 
    const { body } = await this.client.search({
      index: "recipes",
      body: searchBody
    });
    return body;
  }

  async autoRecipes(searchTerm: string) {
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

  async saveRecipe({
    recipe_id,
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
  }: SaveRecipe) {
    await this.client.index({
      index: 'recipes',
      id: recipe_id,
      body: {
        recipe_id,
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

  async deleteRecipe(recipeId: string) {
    await this.client.delete(
      {index: 'recipes', id: recipeId},
      {ignore: [404]}
    );
    await this.client.indices.refresh({index: 'recipes'});
  }
}