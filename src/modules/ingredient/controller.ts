import type { Request, Response } from 'express';

import { NotFoundException } from '../../utils/exceptions.js';
import { NOBSC_USER_ID } from '../shared/model.js';
import { IngredientRepo } from './repo.js';

export const ingredientController = {
  async viewAll(req: Request, res: Response) {
    const owner_id = NOBSC_USER_ID;

    const repo = new IngredientRepo();
    const ingredients = await repo.viewAll(owner_id);
    
    return res.json(ingredients);
  },

  async viewOne(req: Request, res: Response) {
    const { ingredient_id } = req.params;
    const owner_id = NOBSC_USER_ID;

    const repo = new IngredientRepo();
    const ingredient = await repo.viewOne(ingredient_id);
    if (!ingredient) throw NotFoundException();
    if (ingredient.owner_id !== owner_id) throw NotFoundException();  //ForbiddenException();

    return res.json(ingredient);
  }
};
