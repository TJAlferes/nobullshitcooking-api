import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Content } from '../mysql-access/Content';

export const contentController = {
  view: async function(req: Request, res: Response) {
    const content = new Content(pool);

    const rows = await content.view();

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const content = new Content(pool);

    const [ row ] = await content.viewById(id);

    return res.send(row);
  },
  getLinksByContentTypeName: async function(req: Request, res: Response) {
    const name = req.params.name;

    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

    const content = new Content(pool);

    const rows = await content.getLinksByContentTypeName(capitalized);

    return res.send(rows);
  }
};