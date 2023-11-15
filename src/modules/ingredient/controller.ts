import type { Request, Response } from 'express';

import { NotFoundException } from '../../utils/exceptions';
import { NOBSC_USER_ID } from '../shared/model';
import { IngredientRepo } from './repo';

export const ingredientController = {
  async viewAll(req: Request, res: Response) {
    const owner_id = NOBSC_USER_ID;

    const repo = new IngredientRepo();
    const ingredients = await repo.viewAll(owner_id);
    
    return res.json(ingredients);
  },

  async viewOne(req: Request, res: Response) {
    const { ingredient_id } = req.params;
    console.log('INGREDIENT_ID: ', ingredient_id);
    console.log('INGREDIENT_ID: ', ingredient_id);
    const owner_id = NOBSC_USER_ID;

    const repo = new IngredientRepo();
    const ingredient = await repo.viewOne(ingredient_id);
    if (!ingredient) throw new NotFoundException();
    if (ingredient.owner_id !== owner_id) throw new NotFoundException();  //ForbiddenException();

    return res.json(ingredient);
  }
};
