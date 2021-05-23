import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
//import { assert } from 'superstruct';

import { Grocer } from '../../access/mysql';

export class UserGrocerController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    //this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async view(req: Request, res: Response) {
    const ownerId = req.session.userInfo!.id;
    const grocer = new Grocer(this.pool);
    const rows = await grocer.view(ownerId);
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const { name, address, notes } = req.body.equipmentInfo;
    const ownerId = req.session.userInfo!.id;
    const args = {ownerId, name, address, notes};
    //assert(args, validGrocer);
    const grocer = new Grocer(this.pool);
    await grocer.create(args);
    return res.send({message: 'Grocer created.'});
  }

  async update(req: Request, res: Response) {
    const { id, name, address, notes } = req.body.grocerInfo;
    const ownerId = req.session.userInfo!.id;
    const args = {ownerId, name, address, notes};
    //assert(args, validGrocer);
    const grocer = new Grocer(this.pool);
    await grocer.update({id, ...args});
    return res.send({message: 'Grocer updated.'});
  }

  async delete(req: Request, res: Response) {
    const { id } = req.body;
    const ownerId = req.session.userInfo!.id;
    const grocer = new Grocer(this.pool);
    await grocer.delete(id, ownerId);
    return res.send({message: 'Grocer deleted.'});
  }
}