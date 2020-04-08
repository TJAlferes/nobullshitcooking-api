import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { RecipeIngredient } from '../../mysql-access/RecipeIngredient';
import { Ingredient } from '../../mysql-access/Ingredient';
import { validIngredientEntity } from '../../lib/validations/ingredient/ingredientEntity';

export const userIngredientController = {
  viewAllMyPrivateUserIngredients: async function(req: Request, res: Response) {
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;
    const ingredient = new Ingredient(pool);
    const rows = await ingredient.viewIngredients(authorId, ownerId);
    res.send(rows);
  },
  viewMyPrivateUserIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientId);
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;
    const ingredient = new Ingredient(pool);
    const [ row ] = await ingredient.viewIngredientById(ingredientId, authorId, ownerId);
    res.send(row);
  },
  createMyPrivateUserIngredient: async function(req: Request, res: Response) {
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const ingredientName = req.body.ingredientInfo.ingredientName;
    const ingredientDescription = req.body.ingredientInfo.ingredientDescription;
    const ingredientImage = req.body.ingredientInfo.ingredientImage;

    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const ingredientToCreate = validIngredientEntity({
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    });
    const ingredient = new Ingredient(pool);
    await ingredient.createMyPrivateUserIngredient(ingredientToCreate);
    res.send({message: 'Ingredient created.'});
  },
  updateMyPrivateUserIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientInfo.ingredientId);
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const ingredientName = req.body.ingredientInfo.ingredientName;
    const ingredientDescription = req.body.ingredientInfo.ingredientDescription;
    const ingredientImage = req.body.ingredientInfo.ingredientImage;

    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const ingredientToUpdateWith = validIngredientEntity({
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    });
    const ingredient = new Ingredient(pool);
    await ingredient.updateMyPrivateUserIngredient(ingredientToUpdateWith, ingredientId);
    res.send({message: 'Ingredient updated.'});
  },
  deleteMyPrivateUserIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientId);
    const ownerId = req.session!.userInfo.userId;
    const recipeIngredient = new RecipeIngredient(pool);
    const ingredient = new Ingredient(pool);
    await recipeIngredient.deleteRecipeIngredientsByIngredientId(ingredientId);
    await ingredient.deleteMyPrivateUserIngredient(ownerId, ingredientId);
    res.send({message: 'Ingredient deleted.'});
  }
};