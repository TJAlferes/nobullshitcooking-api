import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { validProfileRequest } from '../lib/validations/profile/profileRequest';
import { FavoriteRecipe } from '../mysql-access/FavoriteRecipe';
import { Recipe } from '../mysql-access/Recipe';
import { User } from '../mysql-access/User';

export const profileController = {
  viewProfile: async function(req: Request, res: Response) {
    const username = req.params.username;

    assert({username}, validProfileRequest);

    const user = new User(pool);

    const [ userExists ] = await user.viewUserByName(username);

    if (!userExists.length) return res.send({message: 'User does not exist.'});
    
    const id = userExists[0].user_id;
    const avatar = userExists[0].avatar;
    
    const recipe = new Recipe(pool);

    const publicRecipes = await recipe.viewRecipes(id, 1);

    const favoriteRecipe = new FavoriteRecipe(pool);
    
    const favoriteRecipes = await favoriteRecipe.viewMyFavoriteRecipes(id);

    return res.send({
      message: 'Success.',
      avatar,
      publicRecipes,
      favoriteRecipes
    });
  }
};