import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { RecipeSearch } from '../../access/elasticsearch';
import {
  FavoriteRecipe,
  Recipe,
  RecipeEquipment,
  RecipeIngredient,
  RecipeMethod,
  RecipeSubrecipe,
  SavedRecipe
} from '../../access/mysql';
import {
  createRecipeService,
  updateRecipeService
} from '../../lib/services';
import { validRecipe } from '../../lib/validations/entities';

export class StaffRecipeController {
  esClient: Client;
  pool: Pool;

  constructor(esClient: Client, pool: Pool) {
    this.esClient = esClient;
    this.pool = pool;
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const {
      title,
      description,
      activeTime,
      totalTime,
      directions,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    } = req.body.recipeInfo;
    const authorId = 1;
    const ownerId = 1;

    const args = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    };
    assert(args, validRecipe);

    const recipe = new Recipe(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);
    await createRecipeService({
      ownerId,
      recipeCreation: args,
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
    });

    return res.send({message: 'Recipe created.'});
  }

  async edit(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = 1;
    const ownerId = 1;
    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.edit(id, authorId, ownerId);
    return res.send(row);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.body.recipeInfo.id);
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const {
      title,
      description,
      activeTime,
      totalTime,
      directions,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    } = req.body.recipeInfo;
    const authorId = 1;
    const ownerId = 1;
    if (typeof id === "undefined") {
      return res.send({message: 'Invalid recipe ID!'});
    }

    const args = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    };
    assert(args, validRecipe);

    const recipe = new Recipe(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);
    await updateRecipeService({
      id,
      authorId,
      ownerId,
      recipeUpdate: args,
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
    });

    return res.send({message: 'Recipe updated.'});
  }

  async delete(req: Request, res: Response) {
    // transaction(s)?: TO DO: TRIGGERS
    const id = Number(req.body.id);
    const authorId = 1;
    const ownerId = 1;

    const recipeSearch = new RecipeSearch(this.esClient);
    await recipeSearch.delete(String(id));

    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const savedRecipe = new SavedRecipe(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    await Promise.all([
      favoriteRecipe.deleteAllByRecipeId(id),
      savedRecipe.deleteAllByRecipeId(id),
      recipeMethod.deleteByRecipeId(id),
      recipeEquipment.deleteByRecipeId(id),
      recipeIngredient.deleteByRecipeId(id),
      recipeSubrecipe.deleteByRecipeId(id),
      recipeSubrecipe.deleteBySubrecipeId(id)
    ]);

    // TO DO: what about deleting from plans???
    const recipe = new Recipe(this.pool);
    await recipe.deleteById(id, authorId, ownerId);

    return res.send({message: 'Recipe deleted.'});
  }
}