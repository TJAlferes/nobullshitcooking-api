import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';

import { EquipmentRepository } from '../access/mysql';

export class EquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const repo = new EquipmentRepository(this.pool);
    const rows = await repo.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =       Number(req.params.id);
    const authorId = 1;
    const ownerId =  1;

    const repo = new EquipmentRepository(this.pool);
    const [ row ] = await repo.viewOne(id, authorId, ownerId);
    return res.send(row);
  }
}
