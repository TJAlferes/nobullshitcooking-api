import { Request, Response } from 'express';

import { NOBSC_USER_ID } from '../shared/model';
import { IngredientRepo } from './repo';

export const ingredientController = {
  async viewAll(req: Request, res: Response) {
    const owner_id = NOBSC_USER_ID;

    const repo = new IngredientRepo();
    const rows = await repo.viewAll(owner_id);
    
    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const ingredient_id = req.params.ingredient_id;
    const owner_id      = NOBSC_USER_ID;

    const repo = new IngredientRepo();
    const row = await repo.viewOne({owner_id, ingredient_id});

    return res.send(row);
  }
};
