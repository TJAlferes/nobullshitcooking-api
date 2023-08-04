import { Request, Response } from 'express';

import { EquipmentRepo } from '../access/mysql';

export class EquipmentController {
  async viewAll(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const repo = new EquipmentRepo();
    const rows = await repo.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =       Number(req.params.id);
    const authorId = 1;
    const ownerId =  1;

    const repo = new EquipmentRepo();
    const [ row ] = await repo.viewOne(id, authorId, ownerId);
    return res.send(row);
  }
}
