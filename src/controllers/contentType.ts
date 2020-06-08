import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validContentTypeRequest
} from '../lib/validations/contentType/contentTypeRequest';
import { ContentType } from '../mysql-access/ContentType';

export const contentTypeController = {
  viewContentTypes: async function(req: Request, res: Response) {
    const contentType = new ContentType(pool);

    const rows = await contentType.viewContentTypes();

    res.send(rows);
  },
  viewContentTypeById: async function(req: Request, res: Response) {
    // body instead of params?
    const contentTypeId = Number(req.params.contentTypeId);

    assert({contentTypeId}, validContentTypeRequest);

    const contentType = new ContentType(pool);
    
    const [ row ] = await contentType.viewContentTypeById(contentTypeId);

    res.send(row);
  }
};