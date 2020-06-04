import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { FavoriteRecipe } from '../../mysql-access/FavoriteRecipe';
import { Recipe } from '../../mysql-access/Recipe';
import { User } from '../../mysql-access/User';

export const userProfileController = {
  viewProfile: async function(req: Request, res: Response) {
    const username = req.params.username;

    const user = new User(pool);

    const userExists = await user.getUserIdByUsername(username);

    const id = userExists[0].user_id;
    const avatar = userExists[0].avatar;
    
    const recipe = new Recipe(pool);

    const publicRecipes = await recipe.viewAllMyPublicUserRecipes(id, 1);

    const favoriteRecipe = new FavoriteRecipe(pool);
    
    const favoriteRecipes = await favoriteRecipe.viewMyFavoriteRecipes(id);

    res.send({message: 'Success.', avatar, publicRecipes, favoriteRecipes});
  }
};