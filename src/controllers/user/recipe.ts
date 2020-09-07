import { Request, Response } from 'express';
import { assert, coerce } from 'superstruct';

import { RecipeSearch } from '../../elasticsearch-access/RecipeSearch';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { pool } from '../../lib/connections/mysqlPoolConnection';
import { createRecipeService } from '../../lib/services/create-recipe';
import { updateRecipeService } from '../../lib/services/update-recipe';
import { validRecipeEntity } from '../../lib/validations/recipe/entity';
import { Recipe } from '../../mysql-access/Recipe';
import { RecipeEquipment } from '../../mysql-access/RecipeEquipment';
import { RecipeIngredient } from '../../mysql-access/RecipeIngredient';
import { RecipeMethod } from '../../mysql-access/RecipeMethod';
import { RecipeSubrecipe } from '../../mysql-access/RecipeSubrecipe';

export const userRecipeController = {
  viewPrivate: async function(req: Request, res: Response) {
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const recipe = new Recipe(pool);

    const rows = await recipe.view(authorId, ownerId);

    return res.send(rows);
  },
  viewPublic: async function(req: Request, res: Response) {
    const authorId = req.session!.userInfo.id;
    const ownerId = 1;

    const recipe = new Recipe(pool);

    const rows = await recipe.view(authorId, ownerId);

    return res.send(rows);
  },
  viewPrivateById: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const recipe = new Recipe(pool);

    const [ row ] = await recipe.viewById(id, authorId, ownerId);

    return res.send(row);
  },
  viewPublicById: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = 1;

    const recipe = new Recipe(pool);

    const [ row ] = await recipe.viewById(id, authorId, ownerId);

    return res.send(row);
  },
  getInfoToEditPrivate: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const recipe = new Recipe(pool);

    const [ row ] = await recipe.getInfoToEdit(id, authorId, ownerId);

    return res.send(row);
  },
  getInfoToEditPublic: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = 1;

    const recipe = new Recipe(pool);

    const [ row ] = await recipe.getInfoToEdit(id, authorId, ownerId);

    return res.send(row);
  },
  create: async function(req: Request, res: Response) {
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

    await createRecipeService({
      ownerId,
      recipeCreation,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });
    
    return res.send({message: 'Recipe created.'});
  },
  update: async function(req: Request, res: Response) {
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
  },
  deletePrivateById: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const recipeEquipment = new RecipeEquipment(pool);
    const recipeIngredient = new RecipeIngredient(pool);
    const recipeMethod = new RecipeMethod(pool);
    const recipeSubrecipe = new RecipeSubrecipe(pool);
    const recipe = new Recipe(pool);

    await Promise.all([
      recipeEquipment.deleteByRecipeId(id),
      recipeIngredient.deleteByRecipeId(id),
      recipeMethod.deleteByRecipeId(id),
      recipeSubrecipe.deleteByRecipeId(id),
      recipeSubrecipe.deleteBySubrecipeId(id)
    ]);

    await recipe.deletePrivateById(id, authorId, ownerId);

    return res.send({message: 'Recipe deleted.'});
  },
  disownById: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;

    const recipe = new Recipe(pool);
    const recipeSearch = new RecipeSearch(esClient);

    await recipe.disownById(id, authorId);

    // (make sure the update goes through first though)
    const [ recipeInfoForElasticSearch ] = await recipe.getForElasticSearch(id);
    
    await recipeSearch.save(recipeInfoForElasticSearch[0]);  // fix?

    return res.send({message: 'Recipe disowned.'});
  }
};