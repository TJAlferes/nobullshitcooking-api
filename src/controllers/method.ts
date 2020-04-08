import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Method } from '../mysql-access/Method';
import { validMethodRequest } from '../lib/validations/method/methodRequest';

export const methodController = {
  viewAllMethods: async function(req: Request, res: Response) {
    const method = new Method(pool);
    const rows = await method.viewAllMethods();
    res.send(rows);
  },
  viewMethodById: async function(req: Request, res: Response) {
    const methodId = Number(req.params.methodId);
    validMethodRequest({methodId});
    const method = new Method(pool);
    const [ row ] = await method.viewMethodById(methodId);
    res.send(row);
  }
};