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
    requiredEquipment.map(({ equipment, amount }) => assert({
      recipe: generatedId,
      equipment,
      amount
    }, validRecipeEquipmentEntity));
    requiredEquipment.map(({ equipment, amount }) => {
      recipeEquipmentToCreate.push(generatedId, equipment, amount);
    });
    const placeholders =
      '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);
    await recipeEquipment.create(recipeEquipmentToCreate, placeholders);
  }

  // first check if the ingredients exists?
  if (requiredIngredients.length) {
    let recipeIngredientsToCreate: (string|number)[] = [];
    requiredIngredients.map(({ ingredient, amount, unit }) => assert({
      recipe: generatedId,
      ingredient,
      amount,
      measurement: unit
    }, validRecipeIngredientEntity));
    requiredIngredients.map(({ ingredient, amount, unit }) => {
      recipeIngredientsToCreate.push(generatedId, ingredient, amount, unit);
    });
    const placeholders =
      '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
    await recipeIngredient.create(recipeIngredientsToCreate, placeholders);
  }

  // first check if the subrecipes exists?
  if (requiredSubrecipes.length) {
    let recipeSubrecipesToCreate: (string|number)[] = [];
    requiredSubrecipes.map(({ subrecipe, amount, unit }) => assert({
      recipe: generatedId,
      subrecipe,
      amount,
      measurement: unit
    }, validRecipeSubrecipeEntity));
    requiredSubrecipes.map(({ subrecipe, amount, unit }) => {
      recipeSubrecipesToCreate.push(generatedId, subrecipe, amount, unit);
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