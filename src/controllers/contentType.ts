import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { ContentType } from '../mysql-access/ContentType';

export const contentTypeController = {
  viewContentTypes: async function(req: Request, res: Response) {
    const contentType = new ContentType(pool);

    const rows = await contentType.viewContentTypes();

    return res.send(rows);
  },
  viewContentTypeById: async function(req: Request, res: Response) {
    const contentTypeId = Number(req.params.contentTypeId);

    const contentType = new ContentType(pool);
    
    const [ row ] = await contentType.viewContentTypeById(contentTypeId);

    return res.send(row);
  }
};