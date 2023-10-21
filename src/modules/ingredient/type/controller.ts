import { Request, Response } from 'express';

import { IngredientTypeRepo } from './repo.js';

export const ingredientTypeController = {
  async viewAll(req: Request, res: Response) {
    const repo = new IngredientTypeRepo();
    const rows = await repo.viewAll();

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const ingredient_type_id = Number(req.params.ingredient_type_id);
    
    const repo = new IngredientTypeRepo();
    const row = await repo.viewOne(ingredient_type_id);

    return res.send(row);
  }
};
