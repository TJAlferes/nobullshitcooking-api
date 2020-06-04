import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { validCuisineRequest } from '../lib/validations/cuisine/cuisineRequest';
import { Cuisine } from '../mysql-access/Cuisine';

export const cuisineController = {
  viewCuisines: async function(req: Request, res: Response) {
    const cuisine = new Cuisine(pool);

    const rows = await cuisine.viewCuisines();

    res.send(rows);
  },
  viewCuisineById: async function(req: Request, res: Response) {
    const cuisineId = Number(req.params.cuisineId);

    validCuisineRequest({cuisineId});

    const cuisine = new Cuisine(pool);

    const [ row ] = await cuisine.viewCuisineById(cuisineId);
    
    res.send(row);
  },
  viewCuisineDetailById: async function(req: Request, res: Response) {
    const cuisineId = Number(req.params.cuisineId);

    validCuisineRequest({cuisineId});

    const cuisine = new Cuisine(pool);

    const detail = await cuisine.viewCuisineDetailById(cuisineId);

    res.send(detail);
  }
};