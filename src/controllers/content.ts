import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Content } from '../mysql-access/Content';

export const contentController = {
  getContentLinksByTypeName: async function(req: Request, res: Response) {
    const contentTypeName = req.params.contentTypeName;

    const capitalized =
    contentTypeName.charAt(0).toUpperCase() + contentTypeName.slice(1);

    const content = new Content(pool);

    const rows = await content.getContentLinksByTypeName(capitalized);

    return res.send(rows);
  },
  viewContentById: async function(req: Request, res: Response) {
    const contentId = Number(req.params.contentId);

    const content = new Content(pool);

    const [ row ] = await content.viewContentById(contentId);

    return res.send(row);
  }
};