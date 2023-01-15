'use strict';

import { assert } from 'superstruct';

import {
  ICreatingRecipe,
  IMakeRecipeEquipment,
  IMakeRecipeIngredient,
  IMakeRecipeMethod,
  IMakeRecipeSubrecipe,

  IRecipe,
  IRecipeEquipment,
  IRecipeIngredient,
  IRecipeMethod,
  IRecipeSubrecipe
} from '../../access/mysql';
import { validRecipeEquipment, validRecipeIngredient, validRecipeMethod, validRecipeSubrecipe } from '../validations';

export async function createRecipeService({
  ownerId,
  creatingRecipe,
  equipment,
  ingredients,
  methods,
  subrecipes,
  recipe,
  recipeEquipment,
  recipeIngredient,
  recipeMethod,
  recipeSubrecipe
}: CreateRecipeService) {
  const createdRecipe = await recipe.create(creatingRecipe);
  const recipeId = createdRecipe.insertId;

  /*
  NOTE: order matters! (because these inserts must match the database tables column orders)

  recipeId, (method)Id
  recipeId, amount, (equipment)Id
  recipeId, amount, measurementId, (ingredient)Id
  recipeId, amount, measurementId, (subrecipe)Id
  */

  if (methods.length) {
    methods.map(({ id }) => assert({recipeId, id}, validRecipeMethod));

    const placeholders =     '(?, ?),'.repeat(methods.length).slice(0, -1);  // if 3 methods, then: (?, ?),(?, ?),(?, ?)
    const values: number[] = [];
    methods.map(({ id }) => values.push(recipeId, id));
    
    await recipeMethod.create(placeholders, values);
  }

  if (equipment.length) {
    equipment.map(({ amount, id }) => assert({recipeId, amount, id}, validRecipeEquipment));

    const placeholders =     '(?, ?, ?),'.repeat(equipment.length).slice(0, -1);
    const values: number[] = [];
    equipment.map(({ amount, id }) => values.push(recipeId, amount, id));

    await recipeEquipment.create(placeholders, values);
  }

  if (ingredients.length) {
    ingredients.map(({ amount, measurementId, id }) => assert({recipeId, amount, measurementId, id}, validRecipeIngredient));

    const placeholders =     '(?, ?, ?, ?),'.repeat(ingredients.length).slice(0, -1);
    const values: number[] = [];
    ingredients.map(({ amount, measurementId, id }) => values.push(recipeId, amount, measurementId, id));

    await recipeIngredient.create(placeholders, values);
  }

  if (subrecipes.length) {
    subrecipes.map(({ amount, measurementId, id }) => assert({recipeId, amount, measurementId, id}, validRecipeSubrecipe));

    const placeholders =     '(?, ?, ?, ?),'.repeat(subrecipes.length).slice(0, -1);
    const values: number[] = [];
    subrecipes.map(({ amount, measurementId, id }) => values.push(recipeId, amount, measurementId, id));

    await recipeSubrecipe.create(placeholders, values);
  }
}

interface CreateRecipeService {
  ownerId:          number;

  creatingRecipe:   ICreatingRecipe;
  equipment:        IMakeRecipeEquipment[];
  ingredients:      IMakeRecipeIngredient[];
  methods:          IMakeRecipeMethod[];
  subrecipes:       IMakeRecipeSubrecipe[];

  recipe:           IRecipe;
  recipeEquipment:  IRecipeEquipment;
  recipeIngredient: IRecipeIngredient;
  recipeMethod:     IRecipeMethod;
  recipeSubrecipe:  IRecipeSubrecipe;
}