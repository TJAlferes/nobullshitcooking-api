import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { SavedRecipe, RecipeRepository } from '../../access/mysql';
import { validSavedRecipe } from '../../lib/validations';

export class UserSavedRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUserId = this.viewByUserId.bind(this);
    this.create =       this.create.bind(this);
    this.delete =       this.delete.bind(this);
  }

  async viewByUserId(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;

    const savedRecipe = new SavedRecipe(this.pool);
    const rows = await savedRecipe.viewByUserId(userId);
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId =   req.session.userInfo!.id;
    const ownerId =  1;  // only public recipes may be saved

    assert({userId, recipeId}, validSavedRecipe);

    const recipeRepo = new RecipeRepository(this.pool);
    const recipe = await recipeRepo.viewOneById(recipeId, userId, ownerId);
    if (!recipe)
      return res.send({message: 'Not Found'});
    if (recipe.author_id === userId)
      return res.send({message: 'Your recipes are saved when you create or update them. This "Save" is so you may save public recipes created by others.'});

    const savedRecipe = new SavedRecipe(this.pool);
    await savedRecipe.create(userId, recipeId);
    return res.send({message: 'Saved.'});
  }

  async delete(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId =   req.session.userInfo!.id;

    assert({userId, recipeId}, validSavedRecipe);
    
    const savedRecipe = new SavedRecipe(this.pool);
    await savedRecipe.delete(userId, recipeId);
    return res.send({message: 'Unsaved.'});
  }
}