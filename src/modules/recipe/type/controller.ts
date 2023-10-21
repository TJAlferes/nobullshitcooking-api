import type { Request, Response } from 'express';

import { RecipeTypeRepo } from './repo.js';

export const recipeTypeController = {
  async viewAll(req: Request, res: Response) {
    const repo = new RecipeTypeRepo();
    const rows = await repo.viewAll();

    return res.json(rows);
  },

  async viewOne(req: Request, res: Response) {
    const recipe_type_id = Number(req.params.recipe_type_id);
    
    const repo = new RecipeTypeRepo();
    const row = await repo.viewOne(recipe_type_id);

    return res.json(row);
  }
};
