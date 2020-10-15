'use strict';

import { assert } from 'superstruct';

import { IRecipeSearch } from '../../access/elasticsearch/RecipeSearch';
import { ICreatingRecipe, IRecipe } from '../../access/mysql/Recipe';
import {
  IMakeRecipeEquipment,
  IRecipeEquipment
} from '../../access/mysql/RecipeEquipment';
import {
  IMakeRecipeIngredient,
  IRecipeIngredient
} from '../../access/mysql/RecipeIngredient';
import {
  IMakeRecipeMethod,
  IRecipeMethod
} from '../../access/mysql/RecipeMethod';
import {
  IMakeRecipeSubrecipe,
  IRecipeSubrecipe
} from '../../access/mysql/RecipeSubrecipe';
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
  requiredSubrecipes,
  recipe,
  recipeMethod,
  recipeEquipment,
  recipeIngredient,
  recipeSubrecipe,
  recipeSearch
}: CreateRecipeService) {
  const createdRecipe = await recipe.create(recipeCreation);

  const generatedId = createdRecipe.insertId;  // how would this work without auto_increment?

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
  recipe: IRecipe;
  recipeMethod: IRecipeMethod;
  recipeEquipment: IRecipeEquipment;
  recipeIngredient: IRecipeIngredient;
  recipeSubrecipe: IRecipeSubrecipe;
  recipeSearch: IRecipeSearch;
}