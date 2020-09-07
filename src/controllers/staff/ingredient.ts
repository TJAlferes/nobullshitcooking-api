import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { IngredientSearch } from '../../elasticsearch-access/IngredientSearch';
import { pool } from '../../lib/connections/mysqlPoolConnection';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { validIngredientEntity } from '../../lib/validations/ingredient/entity';
import { Ingredient } from '../../mysql-access/Ingredient';

export const staffIngredientController = {
  create: async function(req: Request, res: Response) {
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const {
      brand,
      variety,
      name,
      altNames,
      description,
      image
    } = req.body.ingredientInfo;

    const authorId = 1;
    const ownerId = 1;

    const ingredientCreation = {
      ingredientTypeId,
      authorId,
      ownerId,
      brand,
      variety,
      name,
      altNames,
      description,
      image
    };

    assert(ingredientCreation, validIngredientEntity);

    const ingredient = new Ingredient(pool);

    const createdIngredient = await ingredient.create(ingredientCreation);

    const generatedId = createdIngredient.insertId;

    const ingredientForInsert =
      await ingredient.getForElasticSearch(generatedId);
    
    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.save(ingredientForInsert);

    return res.send({message: 'Ingredient created.'});
  },
  update: async function(req: Request, res: Response) {
    const id = Number(req.body.ingredientInfo.id);
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const {
      brand,
      variety,
      name,
      altNames,
      description,
      image
    } = req.body.ingredientInfo;

    const authorId = 1;
    const ownerId = 1;

    const ingredientUpdate = {
      ingredientTypeId,
      authorId,
      ownerId,
      brand,
      variety,
      name,
      altNames,
      description,
      image
    };

    assert(ingredientUpdate, validIngredientEntity);

    const ingredient = new Ingredient(pool);

    await ingredient.update({id, ...ingredientUpdate});

    const ingredientForInsert = await ingredient.getForElasticSearch(id);

    const ingredientSearch = new IngredientSearch(esClient);

    await ingredientSearch.save(ingredientForInsert);

    return res.send({message: 'Ingredient updated.'});
  },
  delete: async function(req: Request, res: Response) {
    const id = Number(req.body.id);

    const ingredient = new Ingredient(pool);
    const ingredientSearch = new IngredientSearch(esClient);

    await ingredient.delete(id);
    await ingredientSearch.delete(String(id));

    return res.send({message: 'Ingredient deleted.'});
  }
};