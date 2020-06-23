'use strict';

import { assert } from 'superstruct';

import { esClient } from '../connections/elasticsearchClient';
import { pool } from '../connections/mysqlPoolConnection';
import { RecipeSearch } from '../../elasticsearch-access/RecipeSearch';
import { Recipe, ICreatingRecipe } from '../../mysql-access/Recipe';
import {
  RecipeEquipment,
  IMakeRecipeEquipment
} from '../../mysql-access/RecipeEquipment';
import {
  RecipeIngredient,
  IMakeRecipeIngredient
} from '../../mysql-access/RecipeIngredient';
import {
  RecipeMethod,
  IMakeRecipeMethod
} from '../../mysql-access/RecipeMethod';
import {
  RecipeSubrecipe,
  IMakeRecipeSubrecipe
} from '../../mysql-access/RecipeSubrecipe';
import {
  validRecipeEquipmentEntity
} from '../validations/recipeEquipment/recipeEquipmentEntity';
import {
  validRecipeIngredientEntity
} from '../validations/recipeIngredient/recipeIngredientEntity';
import {
  validRecipeMethodEntity
} from '../validations/recipeMethod/recipeMethodEntity';
import {
  validRecipeSubrecipeEntity
} from '../validations/recipeSubrecipe/recipeSubrecipeEntity';

export async function updateRecipeService({
  recipeId,
  ownerId,
  recipeToUpdateWith,
  requiredMethods,
  requiredEquipment,
  requiredIngredients,
  requiredSubrecipes
}: UpdateRecipeService) {
  const recipe = new Recipe(pool);
  const recipeMethod = new RecipeMethod(pool);
  const recipeEquipment = new RecipeEquipment(pool);
  const recipeIngredient = new RecipeIngredient(pool);
  const recipeSubrecipe = new RecipeSubrecipe(pool);
  const recipeSearch = new RecipeSearch(esClient);

  await recipe.updateMyUserRecipe({recipeId, ...recipeToUpdateWith});

  let recipeMethodsToUpdateWith: number[] = [];
  let recipeMethodsPlaceholders = "none";

  if (requiredMethods.length) {
    requiredMethods.map(rM => assert({
      recipeId,
      methodId: rM.methodId
    }, validRecipeMethodEntity));

    requiredMethods.map(rM => {
      recipeMethodsToUpdateWith.push(recipeId, rM.methodId)
    });

    recipeMethodsPlaceholders = '(?, ?),'
    .repeat(requiredMethods.length)
    .slice(0, -1);
  }

  await recipeMethod.updateRecipeMethods(
    recipeMethodsToUpdateWith,
    recipeMethodsPlaceholders,
    recipeId
  );

  // first check if the equipment exists?

  let recipeEquipmentToUpdateWith: number[] = [];
  let recipeEquipmentPlaceholders = "none";

  if (requiredEquipment.length) {
    recipeEquipmentToUpdateWith = [];

    requiredEquipment
    .map(rE => assert({
      recipeId,
      equipmentId: rE.equipment,
      amount: rE.amount
    }, validRecipeEquipmentEntity));

    requiredEquipment.map(rE => {
      recipeEquipmentToUpdateWith.push(recipeId, rE.equipment, rE.amount)
    });

    recipeEquipmentPlaceholders = '(?, ?, ?),'
    .repeat(requiredEquipment.length)
    .slice(0, -1);
  }

  await recipeEquipment.updateRecipeEquipment(
    recipeEquipmentToUpdateWith,
    recipeEquipmentPlaceholders,
    recipeId
  );

  // first check if the ingredients exists?

  let recipeIngredientsToUpdateWith: number[] = [];
  let recipeIngredientsPlaceholders = "none";

  if (requiredIngredients.length) {
    recipeIngredientsToUpdateWith = [];

    requiredIngredients
    .map(rI => assert({
      recipeId,
      ingredientId: rI.ingredient,
      amount: rI.amount,
      measurementId: rI.unit
    }, validRecipeIngredientEntity));

    requiredIngredients.map(rI => {
      recipeIngredientsToUpdateWith
      .push(recipeId, rI.ingredient, rI.amount, rI.unit);
    });

    recipeIngredientsPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredIngredients.length)
    .slice(0, -1);
  }

  await recipeIngredient.updateRecipeIngredients(
    recipeIngredientsToUpdateWith,
    recipeIngredientsPlaceholders,
    recipeId
  );

  // first check if the subrecipes exists?

  let recipeSubrecipesToUpdateWith: number[] = [];
  let recipeSubrecipesPlaceholders = "none";

  if (requiredSubrecipes.length) {
    recipeSubrecipesToUpdateWith = [];

    requiredSubrecipes
    .map(rS => assert({
      recipeId,
      subrecipeId: rS.subrecipe,
      amount: rS.amount,
      measurementId: rS.unit
    }, validRecipeSubrecipeEntity));

    requiredSubrecipes.map(rS => {
      recipeSubrecipesToUpdateWith
      .push(recipeId, rS.subrecipe, rS.amount, rS.unit);
    });

    recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredSubrecipes.length)
    .slice(0, -1);
  }

  await recipeSubrecipe.updateRecipeSubrecipes(
    recipeSubrecipesToUpdateWith,
    recipeSubrecipesPlaceholders,
    recipeId
  );

  if (ownerId === 1) {
    const [ recipeInfoForElasticSearch ] = await recipe
    .getPublicRecipeForElasticSearchInsert(recipeId);

    await recipeSearch.saveRecipe(recipeInfoForElasticSearch[0]);  // fix?
  }
}

interface UpdateRecipeService {
  recipeId: number;
  ownerId: number;
  recipeToUpdateWith: ICreatingRecipe;
  requiredEquipment: IMakeRecipeEquipment[];
  requiredIngredients: IMakeRecipeIngredient[];
  requiredMethods: IMakeRecipeMethod[];
  requiredSubrecipes: IMakeRecipeSubrecipe[];
}