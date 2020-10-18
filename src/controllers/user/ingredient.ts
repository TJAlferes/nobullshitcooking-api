import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Ingredient } from '../../access/mysql/Ingredient';
import { RecipeIngredient } from '../../access/mysql/RecipeIngredient';
import { validIngredientEntity } from '../../lib/validations/ingredient/entity';

export class UserIngredientController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async view(req: Request, res: Response) {
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const ingredient = new Ingredient(this.pool);

    const rows = await ingredient.view(author, owner);

    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const { id } = req.body;
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const ingredient = new Ingredient(this.pool);

    const [ row ] = await ingredient.viewById(id, author, owner);

    return res.send(row);
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
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

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
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

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

    return res.send({message: 'Ingredient updated.'});
  }

  async delete(req: Request, res: Response) {
    const { id } = req.body;
    const owner = req.session!.userInfo.username;

    const recipeIngredient = new RecipeIngredient(this.pool);
    const ingredient = new Ingredient(this.pool);

    await recipeIngredient.deleteByIngredient(id);
    await ingredient.deleteByOwner(id, owner);

    return res.send({message: 'Ingredient deleted.'});
  }
}