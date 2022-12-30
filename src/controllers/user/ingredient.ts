import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Ingredient, RecipeIngredient } from '../../access/mysql';
import { validIngredient } from '../../lib/validations';

export class UserIngredientController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view =     this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create =   this.create.bind(this);
    this.update =   this.update.bind(this);
    this.delete =   this.delete.bind(this);
  }

  async view(req: Request, res: Response) {
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const ingredient = new Ingredient(this.pool);
    const rows = await ingredient.view(authorId, ownerId);
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id =       Number(req.body.id);
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const ingredient = new Ingredient(this.pool);
    const [ row ] = await ingredient.viewById(id, authorId, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const { brand, variety, name, altNames, description, image } = req.body.ingredientInfo;
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const args = {ingredientTypeId, authorId, ownerId, brand, variety, name, altNames, description, image};
    assert(args, validIngredient);

    const ingredient = new Ingredient(this.pool);
    await ingredient.create(args);

    return res.send({message: 'Ingredient created.'});
  }

  async update(req: Request, res: Response) {
    const id =               Number(req.body.ingredientInfo.id);
    const ingredientTypeId = Number(req.body.ingredientInfo.ingredientTypeId);
    const { brand, variety, name, altNames, description, image } = req.body.ingredientInfo;
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;
    
    const args = {ingredientTypeId, authorId, ownerId, brand, variety, name, altNames, description, image};
    assert(args, validIngredient);

    const ingredient = new Ingredient(this.pool);
    await ingredient.update({id, ...args});

    return res.send({message: 'Ingredient updated.'});
  }

  async delete(req: Request, res: Response) {
    const id =      Number(req.body.id);
    const ownerId = req.session.userInfo!.id;

    const recipeIngredient = new RecipeIngredient(this.pool);
    await recipeIngredient.deleteByIngredientId(id);

    const ingredient = new Ingredient(this.pool);
    await ingredient.deleteById(id, ownerId);
    
    return res.send({message: 'Ingredient deleted.'});
  }
}