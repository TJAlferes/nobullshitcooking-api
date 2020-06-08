import { Request, Response } from 'express';

//import { pool } from '../lib/connections/mysqlPoolConnection';
//import { SavedRecipe } from '../mysql-access/SavedRecipe';

export const savedRecipeController = {
  viewMostSaved: async function(req: Request, res: Response) {
    //const limit = req.body.limit; // no. change.

    //const savedRecipe = new SavedRecipe(pool);

    //const rows = await savedRecipe.viewMostSaved(limit);
    
    //res.send(rows);
    res.send("finish");
  }
};