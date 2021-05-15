import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
//import { assert } from 'superstruct';

//import { validRecipeRequest } from '../lib/validations/recipe/recipeRequest';
import { Recipe } from '../access/mysql';

export class RecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;
    const recipe = new Recipe(this.pool);
    const rows = await recipe.view(authorId, ownerId);
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const authorId = 1;
    const ownerId = 1;
    // defaulted?
    //assert({recipeId}, validRecipeRequest);
    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.viewById(id, authorId, ownerId);
    return res.send(row);
  }
}