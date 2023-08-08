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
import { Recipe }      from '../../domain/Recipe';
import { IRecipeRepo } from '../../infra/repos/mysql';

export class RecipeService {
  repo: IRecipeRepo;  //recipe,
  recipeEquipment,
  recipeIngredient,
  recipeMethod,
  recipeSubrecipe

  constructor(repo: IRecipeRepo) {
    this.repo = repo;
  }
  
  async create({
    recipeInfo,
    // move to RecipeEquipmentService???
    equipment,
    ingredients,
    methods,
    subrecipes,
  }: CreateRecipeService) {
    const recipe = Recipe.create(recipeInfo);
    const createdRecipe = await this.repo.create(recipe);
    const recipeId = createdRecipe.insertId;
  
    /*
    myabe not? namedPlaceholders now

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

  async update({
    recipeId,
    updatingRecipe,
    // move to RecipeEquipmentService???
    equipment,
    ingredients,
    methods,
    subrecipes
  }: UpdateRecipeService) {
    await recipe.update({id: recipeId, ...updatingRecipe});
  
    /*
    NOTE: order matters! The order of elements in the `values` array must match the database tables column orders
    
    recipeId, (method)Id
    recipeId, amount, (equipment)Id
    recipeId, amount, measurementId, (ingredient)Id
    recipeId, amount, measurementId, (subrecipe)Id
    */
    
    let placeholders = "none";
    let values: number[] = [];
    if (methods.length) {
      methods.map(({ id }) => assert({recipeId, id}, validRecipeMethod));
      placeholders = '(?, ?),'.repeat(methods.length).slice(0, -1);  // if 3 methods, then: (?, ?),(?, ?),(?, ?)
      methods.map(({ id }) => values.push(recipeId, id));
    }
    await recipeMethod.update(recipeId, placeholders, values);
    
    placeholders = "none";
    values = [];
    if (equipment.length) {
      equipment.map(({ amount, id }) => assert({recipeId, amount, id}, validRecipeEquipment));
      placeholders = '(?, ?, ?),'.repeat(equipment.length).slice(0, -1);
      equipment.map(({ amount, id }) => values.push(recipeId, amount, id));
    }
    await recipeEquipment.update(recipeId, placeholders, values);
    
    placeholders = "none";
    values = [];
    if (ingredients.length) {
      ingredients.map(({ amount, measurementId, id }) => assert({recipeId, amount, measurementId, id}, validRecipeIngredient));
      placeholders = '(?, ?, ?, ?),'.repeat(ingredients.length).slice(0, -1);
      ingredients.map(({ amount, measurementId, id }) => values.push(recipeId, amount, measurementId, id));
    }
    await recipeIngredient.update(recipeId, placeholders, values);
    
    placeholders = "none";
    values = [];
    if (subrecipes.length) {
      subrecipes.map(({ amount, measurementId, id }) => assert({recipeId, amount, measurementId, id}, validRecipeSubrecipe));
      placeholders = '(?, ?, ?, ?),'.repeat(subrecipes.length).slice(0, -1);
      subrecipes.map(({ amount, measurementId, id }) => values.push(recipeId, amount, measurementId, id));
    }
    await recipeSubrecipe.update(recipeId, placeholders, values);
  }
}

interface CreateRecipeService {
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

interface UpdateRecipeService {
  recipeId:         number;

  updatingRecipe:   ICreatingRecipe;
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
