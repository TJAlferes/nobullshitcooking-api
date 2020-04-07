'use strict';

import { pool } from '../connections/mysqlPoolConnection';
import { esClient } from '../connections/elasticsearchClient';

const Recipe = require('../../mysql-access/Recipe');
import { RecipeMethod, IRecipeMethod } from '../../mysql-access/RecipeMethod';
import { RecipeEquipment, IRecipeEquipment } from '../../mysql-access/RecipeEquipment';
import { RecipeIngredient, IRecipeIngredient } from '../../mysql-access/RecipeIngredient';
import { RecipeSubrecipe, IRecipeSubrecipe } from '../../mysql-access/RecipeSubrecipe';
const RecipeSearch = require('../../elasticsearch-access/RecipeSearch');

const validRecipeMethodsEntity = require('../validations/recipeMethod/recipeMethodEntity');
const validRecipeEquipmentEntity = require('../validations/recipeEquipment/recipeEquipmentEntity');
const validRecipeIngredientsEntity = require('../validations/recipeIngredient/recipeIngredientEntity');
const validRecipeSubrecipesEntity = require('../validations/recipeSubrecipe/recipeSubrecipeEntity');

interface UpdateRecipeService {
  recipeId: number
  ownerId: number
  recipeToUpdateWith: RecipeToUpdateWith
  requiredMethods: []
  requiredEquipment: []
  requiredIngredients: []
  requiredSubrecipes: []
}

interface RecipeToUpdateWith {
  recipeTypeId: number
  cuisineId: number
  authorId: number
  ownerId: number
  title: string
  description: string
  directions: string
  recipeImage: string
  equipmentImage: string
  ingredientsImage: string
  cookingImage: string
}

async function updateRecipeService({
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

  await recipe.updateMyUserRecipe(recipeToUpdateWith, recipeId);

  //

  let recipeMethodsToUpdateWith: number[] = [];
  let recipeMethodsPlaceholders = "none";

  if (requiredMethods.length) {
    requiredMethods.map((rM: IRecipeMethod) => validRecipeMethodsEntity({
      recipeId,
      methodId: rM.methodId
    }));

    requiredMethods.map((rM: IRecipeMethod) => {
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

  //

  let recipeEquipmentToUpdateWith: number[] = [];
  let recipeEquipmentPlaceholders = "none";

  if (requiredEquipment.length) {
    recipeEquipmentToUpdateWith = [];

    requiredEquipment
    .map((rE: IRecipeEquipment) => validRecipeEquipmentEntity({
      recipeId,
      equipmentId: rE.equipment,
      amount: rE.amount
    }));

    requiredEquipment.map((rE: IRecipeEquipment) => {
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

  //

  let recipeIngredientsToUpdateWith: number[] = [];
  let recipeIngredientsPlaceholders = "none";

  if (requiredIngredients.length) {
    recipeIngredientsToUpdateWith = [];

    requiredIngredients
    .map((rI: IRecipeIngredient) => validRecipeIngredientsEntity({
      recipeId,
      ingredientId: rI.ingredient,
      amount: rI.amount,
      measurementId: rI.unit
    }));

    requiredIngredients.map((rI: IRecipeIngredient) => {
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

  //

  let recipeSubrecipesToUpdateWith: number[] = [];
  let recipeSubrecipesPlaceholders = "none";

  if (requiredSubrecipes.length) {
    recipeSubrecipesToUpdateWith = [];

    requiredSubrecipes
    .map((rS: IRecipeSubrecipe) => validRecipeSubrecipesEntity({
      recipeId,
      subrecipeId: rS.subrecipe,
      amount: rS.amount,
      measurementId: rS.unit
    }));

    requiredSubrecipes.map((rS: IRecipeSubrecipe) => {
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
    const recipeInfoForElasticSearch = await recipe
    .getPublicRecipeForElasticSearchInsert(recipeId);

    await recipeSearch.saveRecipe(recipeInfoForElasticSearch);
  }
}

module.exports = updateRecipeService;