import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Cuisine } from '../mysql-access/Cuisine';

export const cuisineController = {
  view: async function(req: Request, res: Response) {
    const cuisine = new Cuisine(pool);

    const rows = await cuisine.view();

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const cuisine = new Cuisine(pool);

    const [ row ] = await cuisine.viewById(id);
    
    return res.send(row);
  },
  viewDetailById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const cuisine = new Cuisine(pool);

    const detail = await cuisine.viewDetailById(id);

    return res.send(detail);
  }
};