'use strict';

import { assert } from 'superstruct';

import { IRecipeSearch } from '../../access/elasticsearch';
import {
  ICreatingRecipe,
  IRecipe,
  IMakeRecipeEquipment, IRecipeEquipment,
  IMakeRecipeIngredient, IRecipeIngredient,
  IMakeRecipeMethod, IRecipeMethod,
  IMakeRecipeSubrecipe, IRecipeSubrecipe
} from '../../access/mysql';
import { validRecipeEquipment, validRecipeIngredient, validRecipeMethod, validRecipeSubrecipe } from '../validations';

export async function updateRecipeService({
  id, authorId, ownerId, updatingRecipe,
  requiredMethods, requiredEquipment, requiredIngredients, requiredSubrecipes,
  recipe, recipeMethod, recipeEquipment, recipeIngredient, recipeSubrecipe, recipeSearch
}: UpdateRecipeService) {
  await recipe.update({id, ...updatingRecipe}, authorId, ownerId);

  /*
  NOTE: order matters!
  
  id, methodId
  id, amount, equipmentId
  id, amount, measurementId, ingredientId
  id, amount, measurementId, subrecipeId
  */
  //const recipeId = id;
  
  let placeholders = "none";
  let values: number[] = [];
  if (requiredMethods.length) {
    requiredMethods.map(({ methodId }) => assert({id, methodId}, validRecipeMethod));
    placeholders = '(?, ?),'.repeat(requiredMethods.length).slice(0, -1);
    requiredMethods.map(({ methodId }) => values.push(id, methodId));
  }
  await recipeMethod.update(id, placeholders, values);
  
  placeholders = "none";
  values = [];
  if (requiredEquipment.length) {
    requiredEquipment.map(({ amount, equipmentId }) => assert({id, amount, equipmentId}, validRecipeEquipment));
    placeholders = '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);
    requiredEquipment.map(({ amount, equipmentId }) => values.push(id, amount, equipmentId));
  }
  await recipeEquipment.update(id, placeholders, values);
  
  placeholders = "none";
  values = [];
  if (requiredIngredients.length) {
    requiredIngredients.map(({ amount, measurementId, ingredientId }) => assert({id, amount, measurementId, ingredientId}, validRecipeIngredient));
    placeholders = '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
    requiredIngredients.map(({ amount, measurementId, ingredientId }) => values.push(id, amount, measurementId, ingredientId));
  }
  await recipeIngredient.update(id, placeholders, values);
  
  placeholders = "none";
  values = [];
  if (requiredSubrecipes.length) {
    requiredSubrecipes.map(({ amount, measurementId, subrecipeId }) => assert({id, amount, measurementId, subrecipeId}, validRecipeSubrecipe));
    placeholders = '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);
    requiredSubrecipes.map(({ amount, measurementId, subrecipeId }) => values.push(id, amount, measurementId, subrecipeId));
  }
  await recipeSubrecipe.update(id, placeholders, values);

  // if public recipe
  if (ownerId === 1) {
    const toSave = await recipe.getForElasticSearchById(id);
    await recipeSearch.save(toSave);
  }
}

interface UpdateRecipeService {
  id: number;
  authorId: number;
  ownerId: number;
  updatingRecipe: ICreatingRecipe;
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