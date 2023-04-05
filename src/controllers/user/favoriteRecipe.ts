import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { FavoriteRecipe, RecipeRepository } from '../../access/mysql';
import { validFavoriteRecipe } from '../../lib/validations';

export class UserFavoriteRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUserId = this.viewByUserId.bind(this);
    this.create =       this.create.bind(this);
    this.delete =       this.delete.bind(this);
  }

  async viewByUserId(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;
    
    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const rows = await favoriteRecipe.viewByUserId(userId);
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId =   req.session.userInfo!.id;
    const ownerId =  1;  // only public recipes may be favorited

    assert({userId, recipeId}, validFavoriteRecipe);

    const recipeRepo = new RecipeRepository(this.pool);
    const recipe = await recipeRepo.viewOneById(recipeId, userId, ownerId);
    if (!recipe) return res.send({message: 'Not Found'});
    if (recipe.author_id === userId) return res.send({message: 'May not favorite own recipe.'});

    const favoriteRecipe = new FavoriteRecipe(this.pool);
    await favoriteRecipe.create(userId, recipeId);
    return res.send({message: 'Favorited.'});
  }

  async delete(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId =   req.session.userInfo!.id;

    assert({userId, recipeId}, validFavoriteRecipe);

    const favoriteRecipe = new FavoriteRecipe(this.pool);
    await favoriteRecipe.delete(userId, recipeId);
    return res.send({message: 'Unfavorited.'});
  }
}
