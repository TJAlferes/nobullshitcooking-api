import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { SavedRecipe } from '../../access/mysql/SavedRecipe';
import {
  validSavedRecipeEntity
} from '../../lib/validations/savedRecipe/entity';

export class UserSavedRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUserId = this.viewByUserId.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByUserId(req: Request, res: Response) {
    const userId = req.session!.userInfo.id;
    const savedRecipe = new SavedRecipe(this.pool);
    const rows = await savedRecipe.viewByUserId(userId);
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId = req.session!.userInfo.id;
    assert({userId, recipeId}, validSavedRecipeEntity);
    const savedRecipe = new SavedRecipe(this.pool);
    await savedRecipe.create(userId, recipeId);
    return res.send({message: 'Saved.'});
  }

  async delete(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId = req.session!.userInfo.id;
    assert({userId, recipeId}, validSavedRecipeEntity);
    const savedRecipe = new SavedRecipe(this.pool);
    await savedRecipe.delete(userId, recipeId);
    return res.send({message: 'Unsaved.'});
  }
}