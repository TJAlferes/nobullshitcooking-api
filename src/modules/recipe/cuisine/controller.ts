import type { Request, Response } from 'express';

import { CuisineRepo } from './repo';

export const cuisineController = {
  async viewAll(req: Request, res: Response) {
    const repo = new CuisineRepo();
    const rows = await repo.viewAll();

    return res.json(rows);
  },

  async viewOne(req: Request, res: Response) {
    const cuisine_id = Number(req.params.cuisine_id);
    console.log('CUISINE_ID: ', cuisine_id);
    console.log('CUISINE_ID: ', cuisine_id);
    const repo = new CuisineRepo();
    const row = await repo.viewOne(cuisine_id);
    
    return res.json(row);
  }
};
