import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { ContentType } from '../mysql-access/ContentType';

export const contentTypeController = {
  view: async function(req: Request, res: Response) {
    const contentType = new ContentType(pool);

    const rows = await contentType.view();

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const contentType = new ContentType(pool);
    
    const [ row ] = await contentType.viewById(id);

    return res.send(row);
  }
};