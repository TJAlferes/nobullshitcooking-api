import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { RecipeSearch } from '../../elasticsearch-access/RecipeSearch';
import { esClient } from '../../lib/connections/elasticsearchClient';  // remove
import { createRecipeService } from '../../lib/services/create-recipe';
import { updateRecipeService } from '../../lib/services/update-recipe';
import { validRecipeEntity } from '../../lib/validations/recipe/entity';
import { Recipe } from '../../mysql-access/Recipe';
import { RecipeEquipment } from '../../mysql-access/RecipeEquipment';
import { RecipeIngredient } from '../../mysql-access/RecipeIngredient';
import { RecipeMethod } from '../../mysql-access/RecipeMethod';
import { RecipeSubrecipe } from '../../mysql-access/RecipeSubrecipe';
import { FavoriteRecipe } from '../../mysql-access/FavoriteRecipe';
import { SavedRecipe } from '../../mysql-access/SavedRecipe';

export class StaffRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
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
      cookingImage
    } = req.body.recipeInfo;
    const authorId = 1;
    const ownerId = 1;
    const recipeCreation = {
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
      cookingImage
    };
    assert(recipeCreation, validRecipeEntity)
    await createRecipeService({
      ownerId,
      recipeCreation,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });
    return res.send({message: 'Recipe created.'});
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
      cookingImage
    } = req.body.recipeInfo;
    const authorId = 1;
    const ownerId = 1;
    if (typeof id === "undefined") {
      return res.send({message: 'Invalid recipe ID!'});
    }
    const recipeUpdate = {
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
      cookingImage
    };
    assert(recipeUpdate, validRecipeEntity);
    await updateRecipeService({
      id,
      authorId,
      ownerId,
      recipeUpdate,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });
    return res.send({message: 'Recipe updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.id);
    // transaction(s)?:
    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const savedRecipe = new SavedRecipe(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const recipe = new Recipe(this.pool);
    const recipeSearch = new RecipeSearch(esClient);
    // what about plans???
    await Promise.all([
      favoriteRecipe.deleteAllByRecipeId(id),
      savedRecipe.deleteAllByRecipeId(id),
      recipeMethod.deleteByRecipeId(id),
      recipeEquipment.deleteByRecipeId(id),
      recipeIngredient.deleteByRecipeId(id),
      recipeSubrecipe.deleteByRecipeId(id),
      recipeSubrecipe.deleteBySubrecipeId(id)
    ]);
    await recipe.deleteById(id);
    await recipeSearch.delete(String(id));
    return res.send({message: 'Recipe deleted.'});
  }
}