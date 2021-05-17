import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Supplier } from '../../access/mysql';

export class StaffSupplierController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async view(req: Request, res: Response) {
    const supplier = new Supplier(this.pool);
    const rows = await supplier.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.body.supplierInfo.id);
    const supplier = new Supplier(this.pool);
    const row = await supplier.viewById(id);
    return res.send([row]);
  }

  async create(req: Request, res: Response) {
    const { name } = req.body.supplierInfo;
    // TO DO: validate
    const supplier = new Supplier(this.pool);
    await supplier.create(name);
    return res.send({message: 'Supplier created.'});
  }

  async update(req: Request, res: Response) {
    const id = Number(req.body.supplierInfo.id);
    const { name } = req.body.supplierInfo;
    // TO DO: validate
    //const supplierToUpdateWith = {supplierName};
    const supplier = new Supplier(this.pool);
    await supplier.update(id, name);
    return res.send({message: 'Supplier updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.supplierInfo.id);
    const supplier = new Supplier(this.pool);
    await supplier.delete(id);
    return res.send({message: 'Supplier deleted.'});
  }
}