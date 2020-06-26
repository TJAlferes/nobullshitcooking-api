import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Cuisine } from '../mysql-access/Cuisine';

export const cuisineController = {
  viewCuisines: async function(req: Request, res: Response) {
    const cuisine = new Cuisine(pool);

    const rows = await cuisine.viewCuisines();

    return res.send(rows);
  },
  viewCuisineById: async function(req: Request, res: Response) {
    const cuisineId = Number(req.params.cuisineId);

    const cuisine = new Cuisine(pool);

    const [ row ] = await cuisine.viewCuisineById(cuisineId);
    
    return res.send(row);
  },
  viewCuisineDetailById: async function(req: Request, res: Response) {
    const cuisineId = Number(req.params.cuisineId);

    const cuisine = new Cuisine(pool);

    const detail = await cuisine.viewCuisineDetailById(cuisineId);

    return res.send(detail);
  }
};