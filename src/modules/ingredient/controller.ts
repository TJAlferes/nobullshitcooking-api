import { Request, Response } from 'express';

import { IngredientRepo } from './repo';

export const ingredientController = {
  async viewAll(req: Request, res: Response) {
    const repo = new IngredientRepo();
    const rows = await repo.viewAll();
    
    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const ingredient_id = req.params.ingredient_id;

    const repo = new IngredientRepo();
    const row = await repo.viewOne(ingredient_id);

    return res.send(row);
  }
};
