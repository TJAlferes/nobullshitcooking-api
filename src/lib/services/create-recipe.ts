'use strict';

import { assert } from 'superstruct';

import { IRecipeSearch } from '../../access/elasticsearch/RecipeSearch';
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
  owner,
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
  await recipe.create(recipeCreation);

  const generatedId = `${recipeCreation.author} ${recipeCreation.title}`;

  if (requiredMethods.length) {
    let recipeMethodsToCreate: string[] = [];
    requiredMethods.map(({ method })=> assert({
      recipe: generatedId,
      method
    }, validRecipeMethodEntity));
    requiredMethods.map(({ method }) => {
      recipeMethodsToCreate.push(generatedId, method)
    });
    const placeholders = '(?, ?),'.repeat(requiredMethods.length).slice(0, -1);
    await recipeMethod.create(recipeMethodsToCreate, placeholders);
  }

  // first check if the equipment exists?
  if (requiredEquipment.length) {
    let recipeEquipmentToCreate: (string|number)[] = [];
    requiredEquipment.map(({ equipmentId, amount }) => assert({
      recipe: generatedId,
      equipmentId,
      amount
    }, validRecipeEquipmentEntity));
    requiredEquipment.map(({ equipmentId, amount }) => {
      recipeEquipmentToCreate.push(generatedId, equipmentId, amount);
    });
    const placeholders =
      '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);
    await recipeEquipment.create(recipeEquipmentToCreate, placeholders);
  }

  // first check if the ingredients exists?
  if (requiredIngredients.length) {
    let recipeIngredientsToCreate: (string|number)[] = [];
    requiredIngredients.map(({ ingredientId, amount, measurement }) => assert({
      recipe: generatedId,
      ingredientId,
      amount,
      measurement
    }, validRecipeIngredientEntity));
    requiredIngredients.map(({ ingredientId, amount, measurement }) => {
      recipeIngredientsToCreate
        .push(generatedId, ingredientId, amount, measurement);
    });
    const placeholders =
      '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
    await recipeIngredient.create(recipeIngredientsToCreate, placeholders);
  }

  // first check if the subrecipes exists?
  if (requiredSubrecipes.length) {
    let recipeSubrecipesToCreate: (string|number)[] = [];
    requiredSubrecipes.map(({ subrecipeId, amount, measurement }) => assert({
      recipe: generatedId,
      subrecipeId,
      amount,
      measurement
    }, validRecipeSubrecipeEntity));
    requiredSubrecipes.map(({ subrecipeId, amount, measurement }) => {
      recipeSubrecipesToCreate.push(generatedId, subrecipeId, amount, measurement);
    })
    const placeholders =
      '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);
    await recipeSubrecipe.create(recipeSubrecipesToCreate, placeholders);
  }
  // if public
  if (owner === "NOBSC") {
    const [ infoForElasticSearch ] =
      await recipe.getForElasticSearch(generatedId);
    await recipeSearch.save(infoForElasticSearch[0]);  // fix?
  }
}

interface CreateRecipeService {
  owner: string;
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