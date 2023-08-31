'use strict';

import { assert } from 'superstruct';

import { Recipe }              from './model';
import { RecipeRepoInterface } from './repo';

//recipeService.create({});
//RecipeEquipmentService.create({});

// ALSO HAVE PrivateRecipeService AND PublicRecipeService OR JUST THIS ONE?
export class RecipeService {
  repo: RecipeRepoInterface;

  constructor(repo: RecipeRepoInterface) {
    this.repo = repo;
  }
  
  async create({ recipeInfo }: CreateRecipeService) {
    const recipe = Recipe.create(recipeInfo).getDTO();
    const createdRecipe = await this.repo.insert(recipe);
    //const recipeId = createdRecipe.insertId;
    return recipe.getRecipeId();
  }

  async update({ recipeId, updatingRecipe }: UpdateRecipeService) {
    await recipe.update({id: recipeId, ...updatingRecipe});
  }
}
