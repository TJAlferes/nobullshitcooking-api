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

export async function updateRecipeService({
  id,
  authorId,
  ownerId,
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
  //if (authorId == 1 && ownerId === 1) {
  //  await recipe.update({id, ...recipeUpdate});  // if staff
  //} else {
  //  await recipe.updatePrivate({id, ...recipeUpdate});  // if user
  //}
  await recipe.update({id, ...recipeUpdate});

  let values: number[] = [];
  let placeholders = "none";

  if (requiredMethods.length) {
    requiredMethods.map(({ methodId }) =>
      assert({id, methodId}, validRecipeMethod)
    );

    requiredMethods.map(({ methodId }) => values.push(id, methodId));

    placeholders = '(?, ?),'.repeat(requiredMethods.length).slice(0, -1);
  }

  await recipeMethod.update(values, placeholders, id);
  
  values = [];
  placeholders = "none";

  if (requiredEquipment.length) {
    requiredEquipment.map(({ equipmentId, amount }) =>
      assert({id, equipmentId, amount}, validRecipeEquipment)
    );

    requiredEquipment.map(({ equipmentId, amount }) =>
      values.push(id, equipmentId, amount)
    );

    placeholders =
      '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);
  }

  await recipeEquipment.update(values, placeholders, id);
  
  values = [];
  placeholders = "none";

  if (requiredIngredients.length) {
    requiredIngredients.map(({ ingredientId, amount, measurementId }) =>
      assert({id, ingredientId, amount, measurementId}, validRecipeIngredient)
    );

    requiredIngredients.map(({ ingredientId, amount, measurementId }) =>
      values.push(id, ingredientId, amount, measurementId)
    );

    placeholders =
      '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
  }

  await recipeIngredient.update(values, placeholders, id);
  
  values = [];
  placeholders = "none";

  if (requiredSubrecipes.length) {
    requiredSubrecipes.map(({ subrecipeId, amount, measurementId }) => assert({
      id,
      subrecipeId,
      amount,
      measurementId
    }, validRecipeSubrecipe));

    requiredSubrecipes.map(({ subrecipeId, amount, measurementId }) =>
      values.push(id, subrecipeId, amount, measurementId)
    );

    placeholders =
      '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);
  }

  await recipeSubrecipe.update(values, placeholders, id);

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