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

export async function updateRecipeService({
  id,
  author,
  owner,
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
  if (author === "NOBSC" && owner === "NOBSC") {
    await recipe.update({id, ...recipeUpdate});  // if staff
  } else {
    await recipe.updatePrivate({id, ...recipeUpdate});  // if user
  }

  let recipeMethodsToUpdateWith: string[] = [];
  let recipeMethodsPlaceholders = "none";
  if (requiredMethods.length) {
    requiredMethods.map(({ method }) => assert({
      recipe: id,
      method
    }, validRecipeMethodEntity));
    requiredMethods.map(({ method }) => {
      recipeMethodsToUpdateWith.push(id, method)
    });
    recipeMethodsPlaceholders =
      '(?, ?),'.repeat(requiredMethods.length).slice(0, -1);
  }
  await recipeMethod
    .update(recipeMethodsToUpdateWith, recipeMethodsPlaceholders, id);

  // first check if the equipment exists?
  let recipeEquipmentToUpdateWith: (string|number)[] = [];
  let recipeEquipmentPlaceholders = "none";
  if (requiredEquipment.length) {
    requiredEquipment.map(({ equipment, amount }) => assert({
      recipe: id,
      equipment,
      amount
    }, validRecipeEquipmentEntity));
    requiredEquipment.map(({ equipment, amount }) => {
      recipeEquipmentToUpdateWith.push(id, equipment, amount)
    });
    recipeEquipmentPlaceholders =
      '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);
  }
  await recipeEquipment
    .update(recipeEquipmentToUpdateWith, recipeEquipmentPlaceholders, id);

  // first check if the ingredients exists?
  let recipeIngredientsToUpdateWith: (string|number)[] = [];
  let recipeIngredientsPlaceholders = "none";
  if (requiredIngredients.length) {
    requiredIngredients.map(({ ingredient, amount, unit }) => assert({
      recipe: id,
      ingredient,
      amount,
      measurement: unit
    }, validRecipeIngredientEntity));
    requiredIngredients.map(({ ingredient, amount, unit }) => {
      recipeIngredientsToUpdateWith.push(id, ingredient, amount, unit);
    });
    recipeIngredientsPlaceholders =
      '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
  }
  await recipeIngredient
    .update(recipeIngredientsToUpdateWith, recipeIngredientsPlaceholders, id);

  // first check if the subrecipes exists?
  let recipeSubrecipesToUpdateWith: (string|number)[] = [];
  let recipeSubrecipesPlaceholders = "none";
  if (requiredSubrecipes.length) {
    requiredSubrecipes.map(({ subrecipe, amount, unit }) => assert({
      recipe: id,
      subrecipe,
      amount,
      measurement: unit
    }, validRecipeSubrecipeEntity));
    requiredSubrecipes.map(({ subrecipe, amount, unit }) => {
      recipeSubrecipesToUpdateWith.push(id, subrecipe, amount, unit);
    });
    recipeSubrecipesPlaceholders =
      '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);
  }
  await recipeSubrecipe
    .update(recipeSubrecipesToUpdateWith, recipeSubrecipesPlaceholders, id);

  // if public
  if (owner === "NOBSC") {
    const [ infoForElasticSearch ] = await recipe.getForElasticSearch(id);
    await recipeSearch.save(infoForElasticSearch[0]);  // fix?
  }
}

interface UpdateRecipeService {
  id: string;
  author: string;
  owner: string;
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