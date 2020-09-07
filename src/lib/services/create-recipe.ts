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
} from '../validations/recipeEquipment/entity';
import {
  validRecipeIngredientEntity
} from '../validations/recipeIngredient/entity';
import { validRecipeMethodEntity } from '../validations/recipeMethod/entity';
import {
  validRecipeSubrecipeEntity
} from '../validations/recipeSubrecipe/entity';

export async function createRecipeService({
  ownerId,
  recipeCreation,
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

  const createdRecipe = await recipe.create(recipeCreation);

  const generatedId = createdRecipe.insertId;

  if (requiredMethods.length) {
    let recipeMethodsToCreate: number[] = [];

    requiredMethods.map(m => assert({
      recipeId: generatedId,
      methodId: m.methodId
    }, validRecipeMethodEntity));

    requiredMethods.map(m => {
      recipeMethodsToCreate.push(generatedId, m.methodId)
    });

    const recipeMethodsPlaceholders =
      '(?, ?),'.repeat(requiredMethods.length).slice(0, -1);

    await recipeMethod.create(recipeMethodsToCreate, recipeMethodsPlaceholders);
  }

  // first check if the equipment exists?

  if (requiredEquipment.length) {
    let recipeEquipmentToCreate: number[] = [];

    requiredEquipment.map(e => assert({
      recipeId: generatedId,
      equipmentId: e.equipment,
      amount: e.amount
    }, validRecipeEquipmentEntity));

    requiredEquipment.map(e => {
      recipeEquipmentToCreate.push(generatedId, e.equipment, e.amount);
    });

    const recipeEquipmentPlaceholders =
      '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);

    await recipeEquipment
      .create(recipeEquipmentToCreate, recipeEquipmentPlaceholders);
  }

  // first check if the ingredients exists?

  if (requiredIngredients.length) {
    let recipeIngredientsToCreate: number[] = [];

    requiredIngredients.map(i => assert({
      recipeId: generatedId,
      ingredientId: i.ingredient,
      amount: i.amount,
      measurementId: i.unit
    }, validRecipeIngredientEntity));

    requiredIngredients.map(i => {
      recipeIngredientsToCreate
        .push(generatedId, i.ingredient, i.amount, i.unit);
    });

    const recipeIngredientsPlaceholders =
      '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);

    await recipeIngredient
      .create(recipeIngredientsToCreate, recipeIngredientsPlaceholders);
  }

  // first check if the subrecipes exists?

  if (requiredSubrecipes.length) {
    let recipeSubrecipesToCreate: number[] = [];

    requiredSubrecipes.map(s => assert({
      recipeId: generatedId,
      subrecipeId: s.subrecipe,
      amount: s.amount,
      measurementId: s.unit
    }, validRecipeSubrecipeEntity));

    requiredSubrecipes.map(s => {
      recipeSubrecipesToCreate.push(generatedId, s.subrecipe, s.amount, s.unit);
    })

    const recipeSubrecipesPlaceholders =
      '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);

    await recipeSubrecipe
      .create(recipeSubrecipesToCreate, recipeSubrecipesPlaceholders);
  }

  // if public
  if (ownerId === 1) {
    const [ recipeInfoForElasticSearch ] =
      await recipe.getForElasticSearch(generatedId);

    await recipeSearch.save(recipeInfoForElasticSearch[0]);  // fix?
  }
}

interface CreateRecipeService {
  ownerId: number;
  recipeCreation: ICreatingRecipe;
  requiredEquipment: IMakeRecipeEquipment[];
  requiredIngredients: IMakeRecipeIngredient[];
  requiredMethods: IMakeRecipeMethod[];
  requiredSubrecipes: IMakeRecipeSubrecipe[];
}