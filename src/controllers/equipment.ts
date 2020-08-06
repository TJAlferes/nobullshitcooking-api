import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Equipment } from '../mysql-access/Equipment';

export const equipmentController = {
  view: async function (req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;

    const equipment = new Equipment(pool);

    const rows = await equipment.view(authorId, ownerId);

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);
    const authorId = 1;
    const ownerId = 1;

    const equipment = new Equipment(pool);

    const [ row ] = await equipment.viewById(id, authorId, ownerId);

    return res.send(row);
  }
};