import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Equipment } from '../access/mysql';

export class EquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const equipment = new Equipment(this.pool);
    const rows = await equipment.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =       Number(req.params.id);
    const authorId = 1;
    const ownerId =  1;

    const equipment = new Equipment(this.pool);
    const [ row ] = await equipment.viewOne(id, authorId, ownerId);
    return res.send(row);
  }
}