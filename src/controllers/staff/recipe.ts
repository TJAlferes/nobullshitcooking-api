import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { RecipeSearch } from '../../access/elasticsearch';
import {
  Recipe,
  RecipeEquipment,
  RecipeIngredient,
  RecipeMethod,
  RecipeSubrecipe
} from '../../access/mysql';
import { createRecipeService } from '../../lib/services/create-recipe';
import { updateRecipeService } from '../../lib/services/update-recipe';
import { validRecipeEntity } from '../../lib/validations/recipe/entity';

export class StaffRecipeController {
  esClient: Client;
  pool: Pool;

  constructor(esClient: Client, pool: Pool) {
    this.esClient = esClient;
    this.pool = pool;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const {
      type,
      cuisine,
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
    const author = "NOBSC";
    const owner = "NOBSC";

    const recipeCreation = {
      type,
      cuisine,
      author,
      owner,
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

    assert(recipeCreation, validRecipeEntity);

    const recipe = new Recipe(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);

    await createRecipeService({
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
    });

    return res.send({message: 'Recipe created.'});
  }

  async update(req: Request, res: Response) {
    const {
      id,
      type,
      cuisine,
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
    const author = "NOBSC";
    const owner = "NOBSC";

    if (typeof id === "undefined") {
      return res.send({message: 'Invalid recipe ID!'});
    }

    const recipeUpdate = {
      type,
      cuisine,
      author,
      owner,
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

    assert(recipeUpdate, validRecipeEntity);

    const recipe = new Recipe(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);

    await updateRecipeService({
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
    });
    
    return res.send({message: 'Recipe updated.'});
  }

  async delete(req: Request, res: Response) {
    const { id } = req.body;

    const recipe = new Recipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);

    // TO DO: what about deleting from plans???
    await recipe.deleteById(id);
    await recipeSearch.delete(id);

    return res.send({message: 'Recipe deleted.'});
  }
}