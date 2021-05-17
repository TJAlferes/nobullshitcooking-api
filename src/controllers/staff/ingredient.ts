import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { IngredientSearch } from '../../access/elasticsearch';
import { Ingredient } from '../../access/mysql';
import { validIngredient } from '../../lib/validations/entities';

export class StaffIngredientController {
  esClient: Client;
  pool: Pool;

  constructor(esClient: Client, pool: Pool) {
    this.esClient = esClient;
    this.pool = pool;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
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

    const args = {
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
    assert(args, validIngredient);

    const ingredient = new Ingredient(this.pool);
    const createdIngredient = await ingredient.create(args);
    const generatedId = createdIngredient.insertId;
    const ingredientForInsert =
      await ingredient.getForElasticSearchById(generatedId);

    const ingredientSearch = new IngredientSearch(this.esClient);
    await ingredientSearch.save(ingredientForInsert);
    return res.send({message: 'Ingredient created.'});
  }

  async update(req: Request, res: Response) {
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

    const args = {
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
    assert(args, validIngredient);

    const ingredient = new Ingredient(this.pool);
    await ingredient.update({id, ...args});
    const ingredientForInsert = await ingredient.getForElasticSearchById(id);

    const ingredientSearch = new IngredientSearch(this.esClient);
    await ingredientSearch.save(ingredientForInsert);
    return res.send({message: 'Ingredient updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ingredient = new Ingredient(this.pool);
    const ingredientSearch = new IngredientSearch(this.esClient);
    await ingredient.delete(id);
    await ingredientSearch.delete(String(id));
    return res.send({message: 'Ingredient deleted.'});
  }
}