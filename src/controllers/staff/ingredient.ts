import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { IngredientSearch } from '../../elasticsearch-access/IngredientSearch';
import { pool } from '../../lib/connections/mysqlPoolConnection';
import { esClient } from '../../lib/connections/elasticsearchClient';
import {
  validIngredientEntity
} from '../../lib/validations/ingredient/ingredientEntity';
import { Ingredient } from '../../mysql-access/Ingredient';

export const staffIngredientController = {
  createIngredient: async function(req: Request, res: Response) {
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

    const authorId = 1;
    const ownerId = 1;

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

    const createdIngredient = await ingredient
    .createIngredient(ingredientToCreate);

    const generatedId = createdIngredient.insertId;

    const ingredientForInsert = await ingredient
    .getIngredientForElasticSearchInsert(generatedId);
    
    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.saveIngredient(ingredientForInsert);

    return res.send({message: 'Ingredient created.'});
  },
  updateIngredient: async function(req: Request, res: Response) {
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

    const authorId = 1;
    const ownerId = 1;

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

    await ingredient.updateIngredient({ingredientId, ...ingredientToUpdateWith});

    const ingredientForInsert = await ingredient
    .getIngredientForElasticSearchInsert(ingredientId);

    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.saveIngredient(ingredientForInsert);

    return res.send({message: 'Ingredient updated.'});
  },
  deleteIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientId);

    const ingredient = new Ingredient(pool);
    const ingredientSearch = new IngredientSearch(esClient);

    await ingredient.deleteIngredient(ingredientId);
    await ingredientSearch.deleteIngredient(String(ingredientId));

    return res.send({message: 'Ingredient deleted.'});
  }
};