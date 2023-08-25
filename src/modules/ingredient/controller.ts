import { Request, Response } from 'express';

import { IngredientRepo } from './repo';

export const ingredientController = {
  async viewAll(req: Request, res: Response) {
    const owner_id =  1;  // MOVE

    const repo = new IngredientRepo();
    const rows = await repo.viewAll(owner_id);
    
    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const ingredient_id = req.params.ingredient_id;
    const owner_id = 1;  // MOVE

    const repo = new IngredientRepo();
    const [ row ] = await repo.viewOne(ingredient_id, owner_id);

    return res.send(row);
  }
};
