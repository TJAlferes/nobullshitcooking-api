'use strict';

import { assert } from 'superstruct';

import { IRecipeSearch } from '../../access/elasticsearch';
import {
  ICreatingRecipe,
  IMakeRecipeEquipment,
  IMakeRecipeIngredient,
  IMakeRecipeMethod,
  IMakeRecipeSubrecipe,

  IRecipe,
  IRecipeEquipment,
  IRecipeIngredient,
  IRecipeMethod,
  IRecipeSubrecipe
} from '../../access/mysql';
import { validRecipeEquipment, validRecipeIngredient, validRecipeMethod, validRecipeSubrecipe } from '../validations';

export async function updateRecipeService({
  id,
  authorId,
  ownerId,
  updatingRecipe,
  equipment,
  ingredients,
  methods,
  subrecipes,
  recipe,
  recipeEquipment,
  recipeIngredient,
  recipeMethod,
  recipeSubrecipe,
  recipeSearch
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
  if (methods.length) {
    methods.map(({ methodId }) => assert({id, methodId}, validRecipeMethod));
    placeholders = '(?, ?),'.repeat(methods.length).slice(0, -1);
    methods.map(({ methodId }) => values.push(id, methodId));
  }
  await recipeMethod.update(id, placeholders, values);
  
  placeholders = "none";
  values = [];
  if (equipment.length) {
    equipment.map(({ amount, equipmentId }) => assert({id, amount, equipmentId}, validRecipeEquipment));
    placeholders = '(?, ?, ?),'.repeat(equipment.length).slice(0, -1);
    equipment.map(({ amount, equipmentId }) => values.push(id, amount, equipmentId));
  }
  await recipeEquipment.update(id, placeholders, values);
  
  placeholders = "none";
  values = [];
  if (ingredients.length) {
    ingredients.map(({ amount, measurementId, ingredientId }) => assert({id, amount, measurementId, ingredientId}, validRecipeIngredient));
    placeholders = '(?, ?, ?, ?),'.repeat(ingredients.length).slice(0, -1);
    ingredients.map(({ amount, measurementId, ingredientId }) => values.push(id, amount, measurementId, ingredientId));
  }
  await recipeIngredient.update(id, placeholders, values);
  
  placeholders = "none";
  values = [];
  if (subrecipes.length) {
    subrecipes.map(({ amount, measurementId, subrecipeId }) => assert({id, amount, measurementId, subrecipeId}, validRecipeSubrecipe));
    placeholders = '(?, ?, ?, ?),'.repeat(subrecipes.length).slice(0, -1);
    subrecipes.map(({ amount, measurementId, subrecipeId }) => values.push(id, amount, measurementId, subrecipeId));
  }
  await recipeSubrecipe.update(id, placeholders, values);

  // if public recipe
  if (ownerId === 1) {
    const toSave = await recipe.getForElasticSearchById(id);
    await recipeSearch.save(toSave);
  }
}

interface UpdateRecipeService {
  id:               number;
  authorId:         number;
  ownerId:          number;
  updatingRecipe:   ICreatingRecipe;
  equipment:        IMakeRecipeEquipment[];
  ingredients:      IMakeRecipeIngredient[];
  methods:          IMakeRecipeMethod[];
  subrecipes:       IMakeRecipeSubrecipe[];
  recipe:           IRecipe;
  recipeEquipment:  IRecipeEquipment;
  recipeIngredient: IRecipeIngredient;
  recipeMethod:     IRecipeMethod;
  recipeSubrecipe:  IRecipeSubrecipe;
  recipeSearch:     IRecipeSearch;
}