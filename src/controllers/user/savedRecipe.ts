import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validSavedRecipeEntity
} from '../../lib/validations/savedRecipe/savedRecipeEntity';
import { SavedRecipe } from '../../mysql-access/SavedRecipe';

export const userSavedRecipeController = {
  viewMySavedRecipes: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;

    const savedRecipe = new SavedRecipe(pool);

    const rows = await savedRecipe.viewMySavedRecipes(userId);

    res.send(rows);
  },
  createMySavedRecipe: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;
    const recipeId = Number(req.body.recipeId);

    assert({userId, recipeId}, validSavedRecipeEntity);

    const savedRecipe = new SavedRecipe(pool);

    await savedRecipe.createMySavedRecipe(userId, recipeId);
    
    res.send({message: 'Saved.'});
  },
  deleteMySavedRecipe: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;
    const recipeId = Number(req.body.recipeId);

    assert({userId, recipeId}, validSavedRecipeEntity);

    const savedRecipe = new SavedRecipe(pool);

    await savedRecipe.deleteMySavedRecipe(userId, recipeId);
    
    res.send({message: 'Unsaved.'});
  }
};