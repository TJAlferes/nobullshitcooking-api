import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { SavedRecipe } from '../../access/mysql';
import {
  validSavedRecipeEntity
} from '../../lib/validations/savedRecipe/entity';

export class UserSavedRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUser = this.viewByUser.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByUser(req: Request, res: Response) {
    const user = req.session!.userInfo.username;

    const savedRecipe = new SavedRecipe(this.pool);

    const rows = await savedRecipe.viewByUser(user);

    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const recipe = req.body.id;
    const user = req.session!.userInfo.username;

    assert({user, recipe}, validSavedRecipeEntity);

    const savedRecipe = new SavedRecipe(this.pool);

    await savedRecipe.create(user, recipe);

    return res.send({message: 'Saved.'});
  }

  async delete(req: Request, res: Response) {
    const recipe = req.body.id;
    const user = req.session!.userInfo.username;

    assert({user, recipe}, validSavedRecipeEntity);

    const savedRecipe = new SavedRecipe(this.pool);

    await savedRecipe.delete(user, recipe);
    
    return res.send({message: 'Unsaved.'});
  }
}