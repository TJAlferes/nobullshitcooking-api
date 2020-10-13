'use strict';

import { assert } from 'superstruct';

import { IRecipeSearch } from '../../elasticsearch-access/RecipeSearch';
import { ICreatingRecipe, IRecipe } from '../../mysql-access/Recipe';
import {
  IMakeRecipeEquipment,
  IRecipeEquipment
} from '../../mysql-access/RecipeEquipment';
import {
  IMakeRecipeIngredient,
  IRecipeIngredient
} from '../../mysql-access/RecipeIngredient';
import {
  IMakeRecipeMethod,
  IRecipeMethod
} from '../../mysql-access/RecipeMethod';
import {
  IMakeRecipeSubrecipe,
  IRecipeSubrecipe
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
  if (authorId == 1 && ownerId === 1) {
    await recipe.update({id, ...recipeUpdate});  // if staff
  } else {
    await recipe.updatePrivate({id, ...recipeUpdate});  // if user
  }

  let recipeMethodsToUpdateWith: number[] = [];
  let recipeMethodsPlaceholders = "none";

  if (requiredMethods.length) {
    requiredMethods.map(m => assert({
      id,
      methodId: m.methodId
    }, validRecipeMethodEntity));

    requiredMethods.map(m => {
      recipeMethodsToUpdateWith.push(id, m.methodId)
    });

    recipeMethodsPlaceholders =
      '(?, ?),'.repeat(requiredMethods.length).slice(0, -1);
  }

  await recipeMethod
    .update(recipeMethodsToUpdateWith, recipeMethodsPlaceholders, id);

  // first check if the equipment exists?

  let recipeEquipmentToUpdateWith: number[] = [];
  let recipeEquipmentPlaceholders = "none";

  if (requiredEquipment.length) {
    recipeEquipmentToUpdateWith = [];

    requiredEquipment.map(e => assert({
      id,
      equipmentId: e.equipment,
      amount: e.amount
    }, validRecipeEquipmentEntity));

    requiredEquipment.map(e => {
      recipeEquipmentToUpdateWith.push(id, e.equipment, e.amount)
    });

    recipeEquipmentPlaceholders =
      '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);
  }

  await recipeEquipment
    .update(recipeEquipmentToUpdateWith, recipeEquipmentPlaceholders, id);

  // first check if the ingredients exists?

  let recipeIngredientsToUpdateWith: number[] = [];
  let recipeIngredientsPlaceholders = "none";

  if (requiredIngredients.length) {
    recipeIngredientsToUpdateWith = [];

    requiredIngredients.map(i => assert({
      id,
      ingredientId: i.ingredient,
      amount: i.amount,
      measurementId: i.unit
    }, validRecipeIngredientEntity));

    requiredIngredients.map(i => {
      recipeIngredientsToUpdateWith.push(id, i.ingredient, i.amount, i.unit);
    });

    recipeIngredientsPlaceholders =
      '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
  }

  await recipeIngredient
    .update(recipeIngredientsToUpdateWith, recipeIngredientsPlaceholders, id);

  // first check if the subrecipes exists?

  let recipeSubrecipesToUpdateWith: number[] = [];
  let recipeSubrecipesPlaceholders = "none";

  if (requiredSubrecipes.length) {
    recipeSubrecipesToUpdateWith = [];

    requiredSubrecipes.map(s => assert({
      id,
      subrecipeId: s.subrecipe,
      amount: s.amount,
      measurementId: s.unit
    }, validRecipeSubrecipeEntity));

    requiredSubrecipes.map(s => {
      recipeSubrecipesToUpdateWith.push(id, s.subrecipe, s.amount, s.unit);
    });

    recipeSubrecipesPlaceholders =
      '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);
  }

  await recipeSubrecipe
    .update(recipeSubrecipesToUpdateWith, recipeSubrecipesPlaceholders, id);

  // if public
  if (ownerId === 1) {
    const [ recipeInfoForElasticSearch ] = await recipe.getForElasticSearch(id);

    await recipeSearch.save(recipeInfoForElasticSearch[0]);  // fix?
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