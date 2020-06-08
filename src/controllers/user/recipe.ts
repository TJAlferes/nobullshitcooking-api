import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { RecipeSearch } from '../../elasticsearch-access/RecipeSearch';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { pool } from '../../lib/connections/mysqlPoolConnection';
import { createRecipeService } from '../../lib/services/create-recipe';
import { updateRecipeService } from '../../lib/services/update-recipe';
import { validRecipeEntity } from '../../lib/validations/recipe/recipeEntity';
import { Recipe } from '../../mysql-access/Recipe';
import { RecipeEquipment } from '../../mysql-access/RecipeEquipment';
import { RecipeIngredient } from '../../mysql-access/RecipeIngredient';
import { RecipeMethod } from '../../mysql-access/RecipeMethod';
import { RecipeSubrecipe } from '../../mysql-access/RecipeSubrecipe';

export const userRecipeController = {
  viewAllMyPrivateUserRecipes: async function(req: Request, res: Response) {
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const recipe = new Recipe(pool);

    const rows = await recipe.viewRecipes(authorId, ownerId);

    res.send(rows);
  },
  viewAllMyPublicUserRecipes: async function(req: Request, res: Response) {
    const authorId = req.session!.userInfo.userId;
    const ownerId = 1;

    const recipe = new Recipe(pool);

    const rows = await recipe.viewRecipes(authorId, ownerId);

    res.send(rows);
  },
  viewMyPrivateUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const recipe = new Recipe(pool);

    const [ row ] = await recipe.viewRecipeById(recipeId, authorId, ownerId);

    res.send(row);
  },
  viewMyPublicUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session!.userInfo.userId;
    const ownerId = 1;

    const recipe = new Recipe(pool);

    const [ row ] = await recipe.viewRecipeById(recipeId, authorId, ownerId);

    res.send(row);
  },
  getInfoToEditMyPrivateUserRecipe: async function(
    req: Request,
    res: Response
  ) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const recipe = new Recipe(pool);

    const row = await recipe
    .getInfoToEditMyUserRecipe(recipeId, authorId, ownerId);

    res.send(row);
  },
  getInfoToEditMyPublicUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session!.userInfo.userId;
    const ownerId = 1;

    const recipe = new Recipe(pool);

    const row = await recipe
    .getInfoToEditMyUserRecipe(recipeId, authorId, ownerId);

    res.send(row);
  },
  createRecipe: async function(req: Request, res: Response) {
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const title = req.body.recipeInfo.title;
    const description = req.body.recipeInfo.description;
    const directions = req.body.recipeInfo.directions;
    const requiredMethods = req.body.recipeInfo.requiredMethods;
    const requiredEquipment = req.body.recipeInfo.requiredEquipment;
    const requiredIngredients = req.body.recipeInfo.requiredIngredients;
    const requiredSubrecipes = req.body.recipeInfo.requiredSubrecipes;
    const recipeImage = req.body.recipeInfo.recipeImage;
    const equipmentImage = req.body.recipeInfo.recipeEquipmentImage;
    const ingredientsImage = req.body.recipeInfo.recipeIngredientsImage;
    const cookingImage = req.body.recipeInfo.recipeCookingImage;

    const authorId = req.session!.userInfo.userId;
    const ownership = req.body.recipeInfo.ownership;
    const ownerId = (ownership === "private")
    ? req.session!.userInfo.userId
    : 1;
    
    const recipeToCreate = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    };

    assert(recipeToCreate, validRecipeEntity);

    await createRecipeService({
      ownerId,
      recipeToCreate,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });
    
    res.send({message: 'Recipe created.'});
  },
  updateMyUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeInfo.recipeId);
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const title = req.body.recipeInfo.title;
    const description = req.body.recipeInfo.description;
    const directions = req.body.recipeInfo.directions;
    const requiredMethods = req.body.recipeInfo.requiredMethods;
    const requiredEquipment = req.body.recipeInfo.requiredEquipment;
    const requiredIngredients = req.body.recipeInfo.requiredIngredients;
    const requiredSubrecipes = req.body.recipeInfo.requiredSubrecipes;
    const recipeImage = req.body.recipeInfo.recipeImage;
    const equipmentImage = req.body.recipeInfo.recipeEquipmentImage;
    const ingredientsImage = req.body.recipeInfo.recipeIngredientsImage;
    const cookingImage = req.body.recipeInfo.recipeCookingImage;

    const authorId = req.session!.userInfo.userId;
    const ownership = req.body.recipeInfo.ownership;
    const ownerId = (ownership === "private")
    ? req.session!.userInfo.userId
    : 1;

    if (typeof recipeId === "undefined") {
      return res.send({message: 'Invalid recipe ID!'});
    }

    const recipeToUpdateWith = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    };

    assert(recipeToUpdateWith, validRecipeEntity);

    await updateRecipeService({
      recipeId,
      ownerId,
      recipeToUpdateWith,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });

    res.send({message: 'Recipe updated.'});
  },
  deleteMyPrivateUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const recipeMethod = new RecipeMethod(pool);
    const recipeEquipment = new RecipeEquipment(pool);
    const recipeIngredient = new RecipeIngredient(pool);
    const recipeSubrecipe = new RecipeSubrecipe(pool);
    const recipe = new Recipe(pool);

    await recipeMethod.deleteRecipeMethods(recipeId);
    await recipeEquipment.deleteRecipeEquipment(recipeId);
    await recipeIngredient.deleteRecipeIngredients(recipeId);
    await recipeSubrecipe.deleteRecipeSubrecipes(recipeId);
    await recipeSubrecipe.deleteRecipeSubrecipesBySubrecipeId(recipeId);
    await recipe.deleteMyPrivateUserRecipe(recipeId, authorId, ownerId);

    res.send({message: 'Recipe deleted.'});
  },
  disownMyPublicUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session!.userInfo.userId;

    const recipe = new Recipe(pool);

    await recipe.disownMyPublicUserRecipe(recipeId, authorId);

    // (make sure the update goes through first though)
    const [ recipeInfoForElasticSearch ] = await recipe
    .getPublicRecipeForElasticSearchInsert(recipeId);

    const recipeSearch = new RecipeSearch(esClient);

    await recipeSearch.saveRecipe(recipeInfoForElasticSearch[0]);  // fix?

    res.send({message: 'Recipe disowned.'});
  }
};