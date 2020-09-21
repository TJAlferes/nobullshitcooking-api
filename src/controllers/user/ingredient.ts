import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { validIngredientEntity } from '../../lib/validations/ingredient/entity';
import { Ingredient } from '../../mysql-access/Ingredient';
import { RecipeIngredient } from '../../mysql-access/RecipeIngredient';

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
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const ingredient = new Ingredient(this.pool);
    const rows = await ingredient.view(authorId, ownerId);
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const ingredient = new Ingredient(this.pool);
    const [ row ] = await ingredient.viewById(id, authorId, ownerId);
    return res.send(row);
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
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
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
    const ingredient = new Ingredient(this.pool);
    await ingredient.create(ingredientCreation);
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
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
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
    const ingredient = new Ingredient(this.pool);
    await ingredient.update({id, ...ingredientUpdate});
    return res.send({message: 'Ingredient updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = req.session!.userInfo.id;
    const recipeIngredient = new RecipeIngredient(this.pool);
    const ingredient = new Ingredient(this.pool);
    await recipeIngredient.deleteByIngredientId(id);
    await ingredient.deleteByOwnerId(id, ownerId);
    return res.send({message: 'Ingredient deleted.'});
  }
}