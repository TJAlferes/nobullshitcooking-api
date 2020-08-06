import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validSavedRecipeEntity
} from '../../lib/validations/savedRecipe/savedRecipeEntity';
import { SavedRecipe } from '../../mysql-access/SavedRecipe';

export const userSavedRecipeController = {
  viewByUserId: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.id;

    const savedRecipe = new SavedRecipe(pool);

    const rows = await savedRecipe.viewByUserId(userId);

    return res.send(rows);
  },
  create: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId = req.session!.userInfo.id;

    assert({userId, recipeId}, validSavedRecipeEntity);

    const savedRecipe = new SavedRecipe(pool);

    await savedRecipe.create(userId, recipeId);
    
    return res.send({message: 'Saved.'});
  },
  delete: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId = req.session!.userInfo.id;

    assert({userId, recipeId}, validSavedRecipeEntity);

    const savedRecipe = new SavedRecipe(pool);

    await savedRecipe.delete(userId, recipeId);
    
    return res.send({message: 'Unsaved.'});
  }
};