import { Request, Response } from 'express';

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
    .getIngredientForElasticSearchInsert(generatedId);
    
    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.saveIngredient(ingredientForInsert[0]);

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

    await ingredient.updateIngredient({ingredientId, ...ingredientToUpdateWith});

    const [ ingredientForInsert ] = await ingredient
    .getIngredientForElasticSearchInsert(ingredientId);

    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.saveIngredient(ingredientForInsert[0]);

    res.send({message: 'Ingredient updated.'});
  },
  deleteIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientId);

    const ingredient = new Ingredient(pool);
    const ingredientSearch = new IngredientSearch(esClient);

    await ingredient.deleteIngredient(ingredientId);
    await ingredientSearch.deleteIngredient(String(ingredientId));

    res.send({message: 'Ingredient deleted.'});
  }
};