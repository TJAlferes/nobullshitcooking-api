import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Product } from '../mysql-access/Product';

export const productController = {
  view: async function (req: Request, res: Response) {
    const product = new Product(pool);

    const rows = await product.view();

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const product = new Product(pool);

    const [ row ] = await product.viewById(id);

    return res.send(row);
  }
};