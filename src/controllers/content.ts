import { Request, Response } from 'express';
//import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
/*import {
  validContentRequest
} from '../lib/validations/content/contentRequest';*/
import { Content } from '../mysql-access/Content';

export const contentController = {
  getContentLinksByTypeName: async function(req: Request, res: Response) {
    const contentTypeName = req.params.contentTypeName;

    const content = new Content(pool);

    const rows = await content.getContentLinksByTypeName(contentTypeName);

    return res.send(rows);
  },
  viewContentById: async function(req: Request, res: Response) {
    const contentId = Number(req.params.contentId);

    //assert({contentId}, validEquipmentRequest);

    const content = new Content(pool);

    const [ row ] = await content.viewContentById(contentId);

    return res.send(row);
  }
};