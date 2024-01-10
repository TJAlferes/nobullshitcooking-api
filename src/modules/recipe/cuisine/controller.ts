import type { Request, Response } from 'express';

import { NotFoundException } from '../../../utils/exceptions';
import { CuisineRepo } from './repo';

export const cuisineController = {
  async viewAll(req: Request, res: Response) {
    const repo = new CuisineRepo();
    const cuisines = await repo.viewAll();

    return res.json(cuisines);
  },

  async viewOne(req: Request, res: Response) {
    const cuisine_id = Number(req.params.cuisine_id);

    const repo = new CuisineRepo();
    const cuisine = await repo.viewOne(cuisine_id);
    if (!cuisine) throw new NotFoundException();
    
    return res.json(cuisine);
  }
};
