import { Request, Response } from 'express';

import { ForbiddenException, NotFoundException } from '../../../utils/exceptions';
import { NOBSC_USER_ID } from '../../shared/model';
import { RecipeRepo } from '../../recipe/repo';
import { FavoriteRecipe } from './model';
import { FavoriteRecipeRepo } from './repo';

export const userFavoriteRecipeController = {
  async viewByUserId(req: Request, res: Response) {
    const user_id = req.session.user_id!;
    
    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const rows = await favoriteRecipeRepo.viewByUserId(user_id);

    return res.send(rows);
  },

  async create(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const user_id   = req.session.user_id!;

    const recipeRepo = new RecipeRepo();
    const recipe = await recipeRepo.viewOneByRecipeId(recipe_id);
    if (!recipe) throw new NotFoundException();
    if (recipe.author_id === user_id) {
      throw new ForbiddenException('May not favorite own recipe.');
    }
    if (recipe.owner_id !== NOBSC_USER_ID) {
      throw new ForbiddenException("May only favorite public recipes.");
    }

    const favoriteRecipe = FavoriteRecipe.create({user_id, recipe_id}).getDTO();

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    await favoriteRecipeRepo.insert(favoriteRecipe);

    return res.status(201);
  },

  async delete(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const user_id = req.session.user_id!;

    const favoriteRecipe = FavoriteRecipe.create({user_id, recipe_id}).getDTO();

    const repo = new FavoriteRecipeRepo();
    await repo.delete(favoriteRecipe);

    return res.status(204);
  }
};
