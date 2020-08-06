import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validIngredientEntity
} from '../../lib/validations/ingredient/ingredientEntity';
import { Ingredient } from '../../mysql-access/Ingredient';
import { RecipeIngredient } from '../../mysql-access/RecipeIngredient';

export const userIngredientController = {
  view: async function(req: Request, res: Response) {
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const ingredient = new Ingredient(pool);

    const rows = await ingredient.view(authorId, ownerId);

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const ingredient = new Ingredient(pool);

    const [ row ] = await ingredient.viewById(id, authorId, ownerId);

    return res.send(row);
  },
  create: async function(req: Request, res: Response) {
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const brand = req.body.ingredientInfo.brand
      ? req.body.ingredientInfo.brand : "";
    const variety = req.body.ingredientInfo.variety
      ? req.body.ingredientInfo.variety : "";
    const { name, description, image } = req.body.ingredientInfo;

    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const ingredientToCreate = {
      ingredientTypeId,
      authorId,
      ownerId,
      brand,
      variety,
      name,
      description,
      image
    };

    assert(ingredientToCreate, validIngredientEntity);

    const ingredient = new Ingredient(pool);

    await ingredient.create(ingredientToCreate);

    return res.send({message: 'Ingredient created.'});
  },
  update: async function(req: Request, res: Response) {
    const id = Number(req.body.ingredientInfo.id);
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const brand = req.body.ingredientInfo.brand
      ? req.body.ingredientInfo.brand : "";
    const variety = req.body.ingredientInfo.variety
      ? req.body.ingredientInfo.variety : "";
    const { name, description, image } = req.body.ingredientInfo;

    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;

    const ingredientToUpdateWith = {
      ingredientTypeId,
      authorId,
      ownerId,
      brand,
      variety,
      name,
      description,
      image
    };

    assert(ingredientToUpdateWith, validIngredientEntity);

    const ingredient = new Ingredient(pool);

    await ingredient.update({id, ...ingredientToUpdateWith});

    return res.send({message: 'Ingredient updated.'});
  },
  delete: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = req.session!.userInfo.id;

    const recipeIngredient = new RecipeIngredient(pool);
    const ingredient = new Ingredient(pool);

    await recipeIngredient.deleteByIngredientId(id);
    await ingredient.deleteByOwnerId(id, ownerId);

    return res.send({message: 'Ingredient deleted.'});
  }
};