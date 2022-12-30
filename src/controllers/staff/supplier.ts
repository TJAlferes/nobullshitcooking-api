import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Supplier } from '../../access/mysql';
import { validSupplier } from '../../lib/validations';

export class StaffSupplierController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response) {
    const { name } = req.body.supplierInfo;

    assert({name}, validSupplier);

    const supplier = new Supplier(this.pool);
    await supplier.create(name);
    return res.send({message: 'Supplier created.'});
  }

  async update(req: Request, res: Response) {
    const id =       Number(req.body.supplierInfo.id);
    const { name } = req.body.supplierInfo;

    assert({name}, validSupplier);

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