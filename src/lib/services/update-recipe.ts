'use strict';

import { assert } from 'superstruct';

import { IRecipeSearch } from '../../access/elasticsearch/RecipeSearch';
import {
  ICreatingRecipe,
  IRecipe,
  IMakeRecipeEquipment,
  IRecipeEquipment,
  IMakeRecipeIngredient,
  IRecipeIngredient,
  IMakeRecipeMethod,
  IRecipeMethod,
  IMakeRecipeSubrecipe,
  IRecipeSubrecipe
} from '../../access/mysql';
import {
  validRecipeEquipmentEntity
} from '../validations/recipeEquipment/entity';
import {
  validRecipeIngredientEntity
} from '../validations/recipeIngredient/entity';
import { validRecipeMethodEntity } from '../validations/recipeMethod/entity';
import {
  validRecipeSubrecipeEntity
} from '../validations/recipeSubrecipe/entity';

export async function updateRecipeService({
  id,
  author,
  owner,
  recipeUpdate,
  requiredMethods,
  requiredEquipment,
  requiredIngredients,
  requiredSubrecipes,
  recipe,
  recipeMethod,
  recipeEquipment,
  recipeIngredient,
  recipeSubrecipe,
  recipeSearch
}: UpdateRecipeService) {
  if (author === "NOBSC" && owner === "NOBSC") {
    await recipe.update({id, ...recipeUpdate});  // if staff
  } else {
    await recipe.updatePrivate({id, ...recipeUpdate});  // if user
  }

  let recipeMethodsToUpdateWith: string[] = [];
  let recipeMethodsPlaceholders = "none";
  if (requiredMethods.length) {
    requiredMethods.map(({ method }) => assert({
      recipe: id,
      method
    }, validRecipeMethodEntity));
    requiredMethods.map(({ method }) => {
      recipeMethodsToUpdateWith.push(id, method)
    });
    recipeMethodsPlaceholders =
      '(?, ?),'.repeat(requiredMethods.length).slice(0, -1);
  }
  await recipeMethod
    .update(recipeMethodsToUpdateWith, recipeMethodsPlaceholders, id);

  // first check if the equipment exists?
  let recipeEquipmentToUpdateWith: (string|number)[] = [];
  let recipeEquipmentPlaceholders = "none";
  if (requiredEquipment.length) {
    requiredEquipment.map(({ equipmentId, amount }) => assert({
      recipe: id,
      equipmentId,
      amount
    }, validRecipeEquipmentEntity));
    requiredEquipment.map(({ equipmentId, amount }) => {
      recipeEquipmentToUpdateWith.push(id, equipmentId, amount)
    });
    recipeEquipmentPlaceholders =
      '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);
  }
  await recipeEquipment
    .update(recipeEquipmentToUpdateWith, recipeEquipmentPlaceholders, id);

  // first check if the ingredients exists?
  let recipeIngredientsToUpdateWith: (string|number)[] = [];
  let recipeIngredientsPlaceholders = "none";
  if (requiredIngredients.length) {
    requiredIngredients.map(({ ingredientId, amount, measurement }) => assert({
      recipe: id,
      ingredientId,
      amount,
      measurement
    }, validRecipeIngredientEntity));
    requiredIngredients.map(({ ingredientId, amount, measurement }) => {
      recipeIngredientsToUpdateWith.push(id, ingredientId, amount, measurement);
    });
    recipeIngredientsPlaceholders =
      '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
  }
  await recipeIngredient
    .update(recipeIngredientsToUpdateWith, recipeIngredientsPlaceholders, id);

  // first check if the subrecipes exists?
  let recipeSubrecipesToUpdateWith: (string|number)[] = [];
  let recipeSubrecipesPlaceholders = "none";
  if (requiredSubrecipes.length) {
    requiredSubrecipes.map(({ subrecipeId, amount, measurement }) => assert({
      recipe: id,
      subrecipeId,
      amount,
      measurement
    }, validRecipeSubrecipeEntity));
    requiredSubrecipes.map(({ subrecipeId, amount, measurement }) => {
      recipeSubrecipesToUpdateWith.push(id, subrecipeId, amount, measurement);
    });
    recipeSubrecipesPlaceholders =
      '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);
  }
  await recipeSubrecipe
    .update(recipeSubrecipesToUpdateWith, recipeSubrecipesPlaceholders, id);

  // if public
  if (owner === "NOBSC") {
    const [ infoForElasticSearch ] = await recipe.getForElasticSearch(id);
    await recipeSearch.save(infoForElasticSearch[0]);  // fix?
  }
}

interface UpdateRecipeService {
  id: string;
  author: string;
  owner: string;
  recipeUpdate: ICreatingRecipe;
  requiredEquipment: IMakeRecipeEquipment[];
  requiredIngredients: IMakeRecipeIngredient[];
  requiredMethods: IMakeRecipeMethod[];
  requiredSubrecipes: IMakeRecipeSubrecipe[];
  recipe: IRecipe;
  recipeMethod: IRecipeMethod;
  recipeEquipment: IRecipeEquipment;
  recipeIngredient: IRecipeIngredient;
  recipeSubrecipe: IRecipeSubrecipe;
  recipeSearch: IRecipeSearch;
}