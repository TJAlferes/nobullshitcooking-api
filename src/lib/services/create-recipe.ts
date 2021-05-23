'use strict';

import { assert } from 'superstruct';

import { IRecipeSearch } from '../../access/elasticsearch';
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
  validRecipeEquipment,
  validRecipeIngredient,
  validRecipeMethod,
  validRecipeSubrecipe
} from '../validations/entities';

export async function createRecipeService({
  ownerId,
  creatingRecipe,
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
}: CreateRecipeService) {
  const createdRecipe = await recipe.create(creatingRecipe);
  const recipeId = createdRecipe.insertId;

  /*
  NOTE: order matters!

  recipeId, methodId
  recipeId, amount, equipmentId
  recipeId, amount, measurementId, ingredientId
  recipeId, amount, measurementId, subrecipeId
  */

  if (requiredMethods.length) {
    requiredMethods.map(({ methodId }) =>
      assert({recipeId, methodId}, validRecipeMethod)
    );

    const placeholders = '(?, ?),'.repeat(requiredMethods.length).slice(0, -1);
    const values: number[] = [];
    requiredMethods.map(({ methodId }) => values.push(recipeId, methodId));
    await recipeMethod.create(placeholders, values);
  }

  if (requiredEquipment.length) {
    requiredEquipment.map(({ amount, equipmentId }) =>
      assert({recipeId, amount, equipmentId}, validRecipeEquipment)
    );

    const placeholders =
      '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);
    const values: number[] = [];
    requiredEquipment.map(({ amount, equipmentId }) =>
      values.push(recipeId, amount, equipmentId)
    );
    await recipeEquipment.create(placeholders, values);
  }

  if (requiredIngredients.length) {
    requiredIngredients.map(({ amount, measurementId, ingredientId }) =>
      assert(
        {recipeId, amount, measurementId, ingredientId}, validRecipeIngredient
      )
    );

    const placeholders =
      '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
    const values: number[] = [];
    requiredIngredients.map(({ amount, measurementId, ingredientId }) =>
      values.push(recipeId, amount, measurementId, ingredientId)
    );
    await recipeIngredient.create(placeholders, values);
  }

  if (requiredSubrecipes.length) {
    requiredSubrecipes.map(({ amount, measurementId, subrecipeId }) =>
      assert(
        {recipeId, amount, measurementId, subrecipeId}, validRecipeSubrecipe
      )
    );

    const placeholders =
      '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);
    const values: number[] = [];
    requiredSubrecipes.map(({ amount, measurementId, subrecipeId }) =>
      values.push(recipeId, amount, measurementId, subrecipeId)
    );
    await recipeSubrecipe.create(placeholders, values);
  }

  // if public recipe
  if (ownerId === 1) {
    const toSave = await recipe.getForElasticSearchById(recipeId);
    await recipeSearch.save(toSave);
  }
}

interface CreateRecipeService {
  ownerId: number;
  creatingRecipe: ICreatingRecipe;
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