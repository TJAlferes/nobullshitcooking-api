import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert, coerce } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { RecipeSearch } from '../../access/elasticsearch/RecipeSearch';
import { Recipe } from '../../access/mysql/Recipe';
import { RecipeEquipment } from '../../access/mysql/RecipeEquipment';
import { RecipeIngredient } from '../../access/mysql/RecipeIngredient';
import { RecipeMethod } from '../../access/mysql/RecipeMethod';
import { RecipeSubrecipe } from '../../access/mysql/RecipeSubrecipe';
import { createRecipeService } from '../../lib/services/create-recipe';
import { updateRecipeService } from '../../lib/services/update-recipe';
import { validRecipeEntity } from '../../lib/validations/recipe/entity';

export class UserRecipeController {
  esClient: Client;
  pool: Pool;

  constructor(esClient: Client, pool: Pool) {
    this.esClient = esClient;
    this.pool = pool;
    this.viewPrivate = this.viewPrivate.bind(this);
    this.viewPublic = this.viewPublic.bind(this);
    this.viewPrivateById = this.viewPrivateById.bind(this);
    this.viewPublicById = this.viewPublicById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deletePrivateById = this.deletePrivateById.bind(this);
    this.disownById = this.disownById.bind(this);
  }

  async viewPrivate(req: Request, res: Response) {
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const recipe = new Recipe(this.pool);
    const rows = await recipe.view(authorId, ownerId);
    return res.send(rows);
  }

  async viewPublic(req: Request, res: Response) {
    const authorId = req.session!.userInfo.id;
    const ownerId = 1;
    const recipe = new Recipe(this.pool);
    const rows = await recipe.view(authorId, ownerId);
    return res.send(rows);
  }

  async viewPrivateById(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.viewById(id, authorId, ownerId);
    return res.send(row);
  }

  async viewPublicById(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = 1;
    const recipe = new Recipe(this.pool)
    const [ row ] = await recipe.viewById(id, authorId, ownerId);
    return res.send(row);
  }

  async getInfoToEditPrivate(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.getInfoToEdit(id, authorId, ownerId);
    return res.send(row);
  }

  async getInfoToEditPublic(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = 1;
    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.getInfoToEdit(id, authorId, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const {
      ownership,
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
    }= req.body.recipeInfo;
    const authorId = req.session!.userInfo.id;
    const ownerId = (ownership === "private") ? req.session!.userInfo.id : 1;
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
    //assert(recipeCreation, validRecipeEntity);
    assert(
      coerce({recipeCreation}, validRecipeEntity),
      validRecipeEntity
    );
    const recipe = new Recipe(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);
    await createRecipeService({
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
    });
    return res.send({message: 'Recipe created.'});
  }

  async update(req: Request, res: Response) {
    const id = Number(req.body.recipeInfo.id);
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const {
      ownership,
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
    }= req.body.recipeInfo;
    const authorId = req.session!.userInfo.id;
    const ownerId = (ownership === "private") ? req.session!.userInfo.id : 1;
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
    //assert(recipeUpdate, validRecipeEntity);
    assert(
      coerce({recipeUpdate}, validRecipeEntity),
      validRecipeEntity
    );
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

  async deletePrivateById(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const recipe = new Recipe(this.pool);
    await Promise.all([
      recipeEquipment.deleteByRecipeId(id),
      recipeIngredient.deleteByRecipeId(id),
      recipeMethod.deleteByRecipeId(id),
      recipeSubrecipe.deleteByRecipeId(id),
      recipeSubrecipe.deleteBySubrecipeId(id)
    ]);
    await recipe.deletePrivateById(id, authorId, ownerId);
    return res.send({message: 'Recipe deleted.'});
  }

  async disownById(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const recipe = new Recipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);
    await recipe.disownById(id, authorId);
    // (make sure the update goes through first though)
    const [ recipeInfoForElasticSearch ] = await recipe.getForElasticSearch(id);
    await recipeSearch.save(recipeInfoForElasticSearch[0]);  // fix?
    return res.send({message: 'Recipe disowned.'});
  }
}