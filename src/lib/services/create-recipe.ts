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

export async function createRecipeService({
  ownerId,
  creatingRecipe,
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
}: CreateRecipeService) {
  const createdRecipe = await recipe.create(creatingRecipe);
  const recipeId = createdRecipe.insertId;

  /*
  NOTE: order matters! (why? it shouldn't, ideally)

  recipeId, methodId
  recipeId, amount, equipmentId
  recipeId, amount, measurementId, ingredientId
  recipeId, amount, measurementId, subrecipeId
  */

  if (methods.length) {
    methods.map(({ methodId }) => assert({recipeId, methodId}, validRecipeMethod));

    const placeholders =     '(?, ?),'.repeat(methods.length).slice(0, -1);
    const values: number[] = [];
    methods.map(({ methodId }) => values.push(recipeId, methodId));
    
    await recipeMethod.create(placeholders, values);
  }

  if (equipment.length) {
    equipment.map(({ amount, equipmentId }) => assert({recipeId, amount, equipmentId}, validRecipeEquipment));

    const placeholders =     '(?, ?, ?),'.repeat(equipment.length).slice(0, -1);
    const values: number[] = [];
    equipment.map(({ amount, equipmentId }) => values.push(recipeId, amount, equipmentId));

    await recipeEquipment.create(placeholders, values);
  }

  if (ingredients.length) {
    ingredients.map(({ amount, measurementId, ingredientId }) => assert({recipeId, amount, measurementId, ingredientId}, validRecipeIngredient));

    const placeholders =     '(?, ?, ?, ?),'.repeat(ingredients.length).slice(0, -1);
    const values: number[] = [];
    ingredients.map(({ amount, measurementId, ingredientId }) => values.push(recipeId, amount, measurementId, ingredientId));

    await recipeIngredient.create(placeholders, values);
  }

  if (subrecipes.length) {
    subrecipes.map(({ amount, measurementId, subrecipeId }) => assert({recipeId, amount, measurementId, subrecipeId}, validRecipeSubrecipe));

    const placeholders =     '(?, ?, ?, ?),'.repeat(subrecipes.length).slice(0, -1);
    const values: number[] = [];
    subrecipes.map(({ amount, measurementId, subrecipeId }) => values.push(recipeId, amount, measurementId, subrecipeId));

    await recipeSubrecipe.create(placeholders, values);
  }

  // if public recipe
  if (ownerId === 1) {
    const toSave = await recipe.getForElasticSearchById(recipeId);
    await recipeSearch.save(toSave);
  }
}

interface CreateRecipeService {
  ownerId:          number;
  creatingRecipe:   ICreatingRecipe;
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