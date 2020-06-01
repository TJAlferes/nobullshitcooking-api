import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { ContentType } from '../mysql-access/ContentType';
import { validContentTypeRequest } from '../lib/validations/contentType/contentTypeRequest';

export const contentTypeController = {
  viewAllContentTypes: async function(req: Request, res: Response) {
    const contentType = new ContentType(pool);
    const rows = await contentType.viewAllContentTypes();
    res.send(rows);
  },
  viewContentTypeById: async function(req: Request, res: Response) {
    const contentTypeId = Number(req.params.contentTypeId);  // body instead of params?
    validContentTypeRequest({contentTypeId});
    const contentType = new ContentType(pool);
    const [ row ] = await contentType.viewContentTypeById(contentTypeId);
    res.send(row);
  }
};