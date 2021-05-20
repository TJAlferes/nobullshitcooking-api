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
import {
  createRecipeService,
  updateRecipeService
} from '../../lib/services';
import { validRecipe } from '../../lib/validations/entities';

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
    this.editPrivate = this.editPrivate.bind(this);
    this.editPublic = this.editPublic.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.disown = this.disown.bind(this);
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
      cookingImage
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
      args,
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

  async editPrivate(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.edit(id, authorId, ownerId);
    return res.send(row);
  }

  async editPublic(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
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
      cookingImage
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
      args,
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
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    await Promise.all([
      recipeEquipment.deleteByRecipeId(id),
      recipeIngredient.deleteByRecipeId(id),
      recipeMethod.deleteByRecipeId(id),
      recipeSubrecipe.deleteByRecipeId(id),
      recipeSubrecipe.deleteBySubrecipeId(id)
    ]);

    // TO DO: what about deleting from plans???
    const recipe = new Recipe(this.pool);
    await recipe.deleteById(id, authorId, ownerId);

    return res.send({message: 'Recipe deleted.'});
  }

  async disown(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;

    const recipe = new Recipe(this.pool);
    await recipe.disownById(id, authorId);
    const toSave = await recipe.getForElasticSearchById(id);

    const recipeSearch = new RecipeSearch(this.esClient);
    await recipeSearch.save(toSave);

    return res.send({message: 'Recipe disowned.'});
  }
}