import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { validMethodRequest } from '../lib/validations/method/methodRequest';
import { Method } from '../mysql-access/Method';

export const methodController = {
  viewMethods: async function(req: Request, res: Response) {
    const method = new Method(pool);

    const rows = await method.viewMethods();

    return res.send(rows);
  },
  viewMethodById: async function(req: Request, res: Response) {
    const methodId = Number(req.params.methodId);

    assert({methodId}, validMethodRequest);

    const method = new Method(pool);

    const [ row ] = await method.viewMethodById(methodId);
    
    return res.send(row);
  }
};