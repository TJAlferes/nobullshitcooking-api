import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Equipment } from '../access/mysql';

export class EquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const author = "NOBSC";
    const owner = "NOBSC";

    const equipment = new Equipment(this.pool);

    const rows = await equipment.view(author, owner);

    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const { id } = req.params;
    const author = "NOBSC";
    const owner = "NOBSC";

    const equipment = new Equipment(this.pool);

    const [ row ] = await equipment.viewById(id, author, owner);
    
    return res.send(row);
  }
}