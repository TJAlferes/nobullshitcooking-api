import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Method } from '../mysql-access/Method';

export const methodController = {
  view: async function(req: Request, res: Response) {
    const method = new Method(pool);

    const rows = await method.view();

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const method = new Method(pool);

    const [ row ] = await method.viewById(id);
    
    return res.send(row);
  }
};