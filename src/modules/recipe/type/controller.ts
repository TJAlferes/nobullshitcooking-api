import type { Request, Response } from 'express';

import { NotFoundException } from '../../../utils/exceptions';
import { RecipeTypeRepo } from './repo';

export const recipeTypeController = {
  async viewAll(req: Request, res: Response) {
    const repo = new RecipeTypeRepo();
    const recipe_types = await repo.viewAll();

    return res.json(recipe_types);
  },

  async viewOne(req: Request, res: Response) {
    const recipe_type_id = Number(req.params.recipe_type_id);
    
    const repo = new RecipeTypeRepo();
    const recipe_type = await repo.viewOne(recipe_type_id);
    if (!recipe_type) throw new NotFoundException();

    return res.json(recipe_type);
  }
};
