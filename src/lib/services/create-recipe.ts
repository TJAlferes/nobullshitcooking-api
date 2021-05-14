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
  recipeCreation,
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
  const createdRecipe = await recipe.create(recipeCreation);

  const generatedId = createdRecipe.insertId;

  if (requiredMethods.length) {
    requiredMethods.map(({ methodId }) =>
      assert({recipeId: generatedId, methodId}, validRecipeMethod)
    );

    const values: number[] = [];

    requiredMethods.map(({ methodId }) => values.push(generatedId, methodId));

    const placeholders = '(?, ?),'.repeat(requiredMethods.length).slice(0, -1);

    await recipeMethod.create(values, placeholders);
  }

  if (requiredEquipment.length) {
    requiredEquipment.map(({ equipmentId, amount }) => assert({
      recipeId: generatedId,
      equipmentId,
      amount
    }, validRecipeEquipment));

    const values: number[] = [];

    requiredEquipment.map(({ equipmentId, amount }) =>
      values.push(generatedId, equipmentId, amount)
    );

    const placeholders =
      '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);

    await recipeEquipment.create(values, placeholders);
  }

  if (requiredIngredients.length) {
    requiredIngredients.map(({ ingredientId, amount, measurementId }) =>
      assert({
        recipeId: generatedId,
        ingredientId,
        amount,
        measurementId
      }, validRecipeIngredient)
    );

    const values: number[] = [];

    requiredIngredients.map(({ ingredientId, amount, measurementId }) =>
      values.push(generatedId, ingredientId, amount, measurementId)
    );

    const placeholders =
      '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
    
    await recipeIngredient.create(values, placeholders);
  }

  if (requiredSubrecipes.length) {
    requiredSubrecipes.map(({ subrecipeId, amount, measurementId }) => assert({
      recipeId: generatedId,
      subrecipeId,
      amount,
      measurementId
    }, validRecipeSubrecipe));

    const values: number[] = [];

    requiredSubrecipes.map(({ subrecipeId, amount, measurementId }) =>
      values.push(generatedId, subrecipeId, amount, measurementId)
    );

    const placeholders =
      '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);
    
    await recipeSubrecipe.create(values, placeholders);
  }

  // if public recipe
  if (ownerId === 1) {
    const [ row ] = await recipe.getForElasticSearchById(generatedId);
    await recipeSearch.save(row[0]);  // fix?
  }
}

interface CreateRecipeService {
  ownerId: number;
  recipeCreation: ICreatingRecipe;
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