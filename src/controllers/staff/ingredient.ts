import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { Ingredient } from '../../mysql-access/Ingredient';
import { IngredientSearch } from '../../elasticsearch-access/IngredientSearch';
import { validIngredientEntity } from '../../lib/validations/ingredient/ingredientEntity';

export const staffIngredientController = {
  createIngredient: async function(req: Request, res: Response) {
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const ingredientName = req.body.ingredientInfo.ingredientName;
    const ingredientDescription = req.body.ingredientInfo.ingredientDescription;
    const ingredientImage = req.body.ingredientInfo.ingredientImage;

    const authorId = 1;
    const ownerId = 1;

    const ingredientToCreate = validIngredientEntity({
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    });

    const ingredient = new Ingredient(pool);

    const createdIngredient = await ingredient
    .createIngredient(ingredientToCreate);

    const generatedId = createdIngredient.insertId;

    const [ ingredientForInsert ] = await ingredient
    .getIngredientForElasticSearchInsert(generatedId, ownerId);

    const ingredientInfo = {
      ingredientId: ingredientForInsert[0].ingredientId,
      ingredientTypeName: ingredientForInsert[0].ingredientTypeName,
      ingredientName: ingredientForInsert[0].ingredientName,
      ingredientImage: ingredientForInsert[0].ingredientImage
    };

    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.saveIngredient(ingredientInfo);

    res.send({message: 'Ingredient created.'});
  },
  updateIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientInfo.ingredientId);
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const ingredientName = req.body.ingredientInfo.ingredientName;
    const ingredientDescription = req.body.ingredientInfo.ingredientDescription;
    const ingredientImage = req.body.ingredientInfo.ingredientImage;

    const authorId = 1;
    const ownerId = 1;

    const ingredientToUpdateWith = validIngredientEntity({
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    });

    const ingredient = new Ingredient(pool);

    await ingredient.updateIngredient(ingredientToUpdateWith, ingredientId);

    const [ ingredientForInsert ] = await ingredient
    .getIngredientForElasticSearchInsert(ingredientId, ownerId);

    const ingredientInfo = {
      ingredientId: ingredientForInsert[0].ingredientId,
      ingredientTypeName: ingredientForInsert[0].ingredientTypeName,
      ingredientName: ingredientForInsert[0].ingredientName,
      ingredientImage: ingredientForInsert[0].ingredientImage
    };

    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.saveIngredient(ingredientInfo);

    res.send({message: 'Ingredient updated.'});
  },
  deleteIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientId);

    const ingredient = new Ingredient(pool);
    await ingredient.deleteIngredient(ingredientId);

    const ingredientSearch = new IngredientSearch(esClient);
    await ingredientSearch.deleteIngredient(String(ingredientId));

    res.send({message: 'Ingredient deleted.'});
  }
};