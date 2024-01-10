import type { Request, Response } from 'express';

import { NotFoundException } from '../../../utils/exceptions';
import { IngredientTypeRepo } from './repo';

export const ingredientTypeController = {
  async viewAll(req: Request, res: Response) {
    const repo = new IngredientTypeRepo();
    const ingredient_types = await repo.viewAll();

    return res.json(ingredient_types);
  },

  async viewOne(req: Request, res: Response) {
    const ingredient_type_id = Number(req.params.ingredient_type_id);
    
    const repo = new IngredientTypeRepo();
    const ingredient_type = await repo.viewOne(ingredient_type_id);
    if (!ingredient_type) throw new NotFoundException();

    return res.json(ingredient_type);
  }
};
