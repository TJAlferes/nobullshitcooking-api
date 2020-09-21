import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Equipment } from '../mysql-access/Equipment';

export class EquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;
    const equipment = new Equipment(this.pool);
    const rows = await equipment.view(authorId, ownerId);
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const authorId = 1;
    const ownerId = 1;
    const equipment = new Equipment(this.pool);
    const [ row ] = await equipment.viewById(id, authorId, ownerId);
    return res.send(row);
  }
}