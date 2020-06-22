import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validIngredientEntity
} from '../../lib/validations/ingredient/ingredientEntity';
import { Ingredient } from '../../mysql-access/Ingredient';
import { RecipeIngredient } from '../../mysql-access/RecipeIngredient';

export const userIngredientController = {
  viewAllMyPrivateUserIngredients: async function(req: Request, res: Response) {
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const ingredient = new Ingredient(pool);

    const rows = await ingredient.viewIngredients(authorId, ownerId);

    return res.send(rows);
  },
  viewMyPrivateUserIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientId);
    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const ingredient = new Ingredient(pool);

    const [ row ] = await ingredient
    .viewIngredientById(ingredientId, authorId, ownerId);

    return res.send(row);
  },
  createMyPrivateUserIngredient: async function(req: Request, res: Response) {
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const ingredientBrand = req.body.ingredientInfo.ingredientBrand
      ? req.body.ingredientInfo.ingredientBrand
      : "";
    const ingredientVariety = req.body.ingredientInfo.ingredientVariety
      ? req.body.ingredientInfo.ingredientVariety
      : "";
    const ingredientName = req.body.ingredientInfo.ingredientName;
    const ingredientDescription = req.body.ingredientInfo.ingredientDescription;
    const ingredientImage = req.body.ingredientInfo.ingredientImage;

    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const ingredientToCreate = {
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientBrand,
      ingredientVariety,
      ingredientName,
      ingredientDescription,
      ingredientImage
    };

    assert(ingredientToCreate, validIngredientEntity);

    const ingredient = new Ingredient(pool);

    await ingredient.createMyPrivateUserIngredient(ingredientToCreate);

    return res.send({message: 'Ingredient created.'});
  },
  updateMyPrivateUserIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientInfo.ingredientId);
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const ingredientBrand = req.body.ingredientInfo.ingredientBrand
      ? req.body.ingredientInfo.ingredientBrand
      : "";
    const ingredientVariety = req.body.ingredientInfo.ingredientVariety
      ? req.body.ingredientInfo.ingredientVariety
      : "";
    const ingredientName = req.body.ingredientInfo.ingredientName;
    const ingredientDescription = req.body.ingredientInfo.ingredientDescription;
    const ingredientImage = req.body.ingredientInfo.ingredientImage;

    const authorId = req.session!.userInfo.userId;
    const ownerId = req.session!.userInfo.userId;

    const ingredientToUpdateWith = {
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientBrand,
      ingredientVariety,
      ingredientName,
      ingredientDescription,
      ingredientImage
    };

    assert(ingredientToUpdateWith, validIngredientEntity);

    const ingredient = new Ingredient(pool);

    await ingredient.updateMyPrivateUserIngredient({
      ingredientId,
      ...ingredientToUpdateWith
    });

    return res.send({message: 'Ingredient updated.'});
  },
  deleteMyPrivateUserIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientId);
    const ownerId = req.session!.userInfo.userId;

    const recipeIngredient = new RecipeIngredient(pool);
    const ingredient = new Ingredient(pool);

    await recipeIngredient.deleteRecipeIngredientsByIngredientId(ingredientId);
    await ingredient.deleteMyPrivateUserIngredient(ingredientId, ownerId);

    return res.send({message: 'Ingredient deleted.'});
  }
};