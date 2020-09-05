import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Supplier } from '../mysql-access/Supplier';

export const supplierController = {
  view: async function(req: Request, res: Response) {
    const supplier = new Supplier(pool);

    const rows = await supplier.view();

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const supplier = new Supplier(pool);

    const [ row ] = await supplier.viewById(id);
    
    return res.send(row);
  }
};