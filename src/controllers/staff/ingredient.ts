import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { IngredientSearch } from '../../access/elasticsearch/IngredientSearch';
import { Ingredient } from '../../access/mysql/Ingredient';
import { validIngredientEntity } from '../../lib/validations/ingredient/entity';

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
    const {
      type,
      brand,
      variety,
      name,
      altNames,
      description,
      image
    } = req.body.ingredientInfo;
    const author = "NOBSC";
    const owner = "NOBSC";

    const ingredientCreation = {
      type,
      author,
      owner,
      brand,
      variety,
      name,
      altNames,
      description,
      image
    };

    assert(ingredientCreation, validIngredientEntity);

    const ingredient = new Ingredient(this.pool);

    await ingredient.create(ingredientCreation);

    const generatedId = `${author} ${brand} ${variety} ${name}`;

    const ingredientForInsert =
      await ingredient.getForElasticSearch(generatedId);
    
    const ingredientSearch = new IngredientSearch(this.esClient);

    await ingredientSearch.save(ingredientForInsert);

    return res.send({message: 'Ingredient created.'});
  }

  async update(req: Request, res: Response) {
    const {
      id,
      type,
      brand,
      variety,
      name,
      altNames,
      description,
      image
    } = req.body.ingredientInfo;
    const author = "NOBSC";
    const owner = "NOBSC";

    const ingredientUpdate = {
      type,
      author,
      owner,
      brand,
      variety,
      name,
      altNames,
      description,
      image
    };

    assert(ingredientUpdate, validIngredientEntity);

    const ingredient = new Ingredient(this.pool);

    await ingredient.update({id, ...ingredientUpdate});

    const ingredientForInsert = await ingredient.getForElasticSearch(id);

    const ingredientSearch = new IngredientSearch(this.esClient);

    await ingredientSearch.save(ingredientForInsert);

    return res.send({message: 'Ingredient updated.'});
  }

  async delete(req: Request, res: Response) {
    const { id } = req.body;

    const ingredient = new Ingredient(this.pool);
    const ingredientSearch = new IngredientSearch(this.esClient);

    await ingredient.delete(id);
    await ingredientSearch.delete(id);
    
    return res.send({message: 'Ingredient deleted.'});
  }
}