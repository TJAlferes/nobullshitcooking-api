'use strict';

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

export async function createRecipeService({
  ownerId,
  recipeToCreate,
  requiredMethods,
  requiredEquipment,
  requiredIngredients,
  requiredSubrecipes
}: CreateRecipeService) {
  const recipe = new Recipe(pool);
  const recipeMethod = new RecipeMethod(pool);
  const recipeEquipment = new RecipeEquipment(pool);
  const recipeIngredient = new RecipeIngredient(pool);
  const recipeSubrecipe = new RecipeSubrecipe(pool);
  const recipeSearch = new RecipeSearch(esClient);

  const createdRecipe = await recipe.createRecipe(recipeToCreate);

  const generatedId = createdRecipe.insertId;

  if (requiredMethods.length) {
    let recipeMethodsToCreate: number[] = [];

    requiredMethods.map(rM => validRecipeMethodEntity({
      recipeId: generatedId,
      methodId: rM.methodId
    }));

    requiredMethods.map(rM => {
      recipeMethodsToCreate.push(generatedId, rM.methodId)
    });

    const recipeMethodsPlaceholders = '(?, ?),'
    .repeat(requiredMethods.length)
    .slice(0, -1);

    await recipeMethod.createRecipeMethods(
      recipeMethodsToCreate,
      recipeMethodsPlaceholders
    );
  }

  if (requiredEquipment.length) {
    let recipeEquipmentToCreate: number[] = [];

    requiredEquipment
    .map(rE => validRecipeEquipmentEntity({
      recipeId: generatedId,
      equipmentId: rE.equipment,
      amount: rE.amount
    }));

    requiredEquipment.map(rE => {
      recipeEquipmentToCreate.push(generatedId, rE.equipment, rE.amount);
    });

    const recipeEquipmentPlaceholders = '(?, ?, ?),'
    .repeat(requiredEquipment.length)
    .slice(0, -1);

    await recipeEquipment.createRecipeEquipment(
      recipeEquipmentToCreate,
      recipeEquipmentPlaceholders
    );
  }

  if (requiredIngredients.length) {
    let recipeIngredientsToCreate: number[] = [];

    requiredIngredients
    .map(rI => validRecipeIngredientEntity({
      recipeId: generatedId,
      ingredientId: rI.ingredient,
      amount: rI.amount,
      measurementId: rI.unit
    }));

    requiredIngredients.map(rI => {
      recipeIngredientsToCreate
      .push(generatedId, rI.ingredient, rI.amount, rI.unit);
    });

    const recipeIngredientsPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredIngredients.length)
    .slice(0, -1);

    await recipeIngredient.createRecipeIngredients(
      recipeIngredientsToCreate,
      recipeIngredientsPlaceholders
    );
  }

  if (requiredSubrecipes.length) {
    let recipeSubrecipesToCreate: number[] = [];

    requiredSubrecipes
    .map(rS => validRecipeSubrecipeEntity({
      recipeId: generatedId,
      subrecipeId: rS.subrecipe,
      amount: rS.amount,
      measurementId: rS.unit
    }));

    requiredSubrecipes.map(rS => {
      recipeSubrecipesToCreate
      .push(generatedId, rS.subrecipe, rS.amount, rS.unit);
    })

    const recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredSubrecipes.length)
    .slice(0, -1);

    await recipeSubrecipe.createRecipeSubrecipes(
      recipeSubrecipesToCreate,
      recipeSubrecipesPlaceholders
    );
  }

  if (ownerId === 1) {
    const [ recipeInfoForElasticSearch ] = await recipe
    .getPublicRecipeForElasticSearchInsert(generatedId);

    await recipeSearch.saveRecipe(recipeInfoForElasticSearch[0]);  // fix?
  }
}

interface CreateRecipeService {
  ownerId: number;
  recipeToCreate: ICreatingRecipe;
  requiredEquipment: IMakeRecipeEquipment[];
  requiredIngredients: IMakeRecipeIngredient[];
  requiredMethods: IMakeRecipeMethod[];
  requiredSubrecipes: IMakeRecipeSubrecipe[];
}