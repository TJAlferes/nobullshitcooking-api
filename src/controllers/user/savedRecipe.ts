import { Request, Response } from 'express';

const pool = require('../../lib/connections/mysqlPoolConnection');
const SavedRecipe = require('../../mysql-access/SavedRecipe');
const validSavedRecipeEntity = require('../../lib/validations/savedRecipe/savedRecipeEntity');

const userSavedRecipeController = {
  viewMySavedRecipes: async function(req: Request, res: Response) {
    const userId = req.session.userInfo.userId;
    const savedRecipe = new SavedRecipe(pool);
    const rows = await savedRecipe.viewMySavedRecipes(userId);
    res.send(rows);
  },
  createMySavedRecipe: async function(req: Request, res: Response) {
    const userId = req.session.userInfo.userId;
    const recipeId = Number(req.body.recipeId);
    validSavedRecipeEntity({userId, recipeId});
    const savedRecipe = new SavedRecipe(pool);
    await savedRecipe.createMySavedRecipe(userId, recipeId);
    res.send({message: 'Saved.'});
  },
  deleteMySavedRecipe: async function(req: Request, res: Response) {
    const userId = req.session.userInfo.userId;
    const recipeId = Number(req.body.recipeId);
    validSavedRecipeEntity({userId, recipeId});
    const savedRecipe = new SavedRecipe(pool);
    await savedRecipe.deleteMySavedRecipe(userId, recipeId);
    res.send({message: 'Unsaved.'});
  }
};

module.exports = userSavedRecipeController;