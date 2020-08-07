import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { CuisineSupplier } from '../../mysql-access/CuisineSupplier';
import { Supplier } from '../../mysql-access/Supplier';

export const staffSupplierController = {
  view: async function (req: Request, res: Response) {
    const supplier = new Supplier(pool);

    const rows = await supplier.view();

    return res.send({suppliers: rows});
  },
  viewById: async function (req: Request, res: Response) {
    const id = Number(req.body.supplierInfo.id);

    const supplier = new Supplier(pool);

    const row = await supplier.viewById(id);

    return res.send({supplier: row});
  },
  create: async function (req: Request, res: Response) {
    const { name } = req.body.supplierInfo;

    // TO DO: validate
    
    const supplier = new Supplier(pool);

    await supplier.create(name);

    return res.send({message: 'Supplier created.'});
  },
  update: async function (req: Request, res: Response) {
    const id = Number(req.body.supplierInfo.id);
    const { name } = req.body.supplierInfo;

    // TO DO: validate

    //const supplierToUpdateWith = {supplierName};

    const supplier = new Supplier(pool);

    await supplier.update(id, name);

    return res.send({message: 'Supplier updated.'});
  },
  delete: async function (req: Request, res: Response) {
    const id = Number(req.body.supplierInfo.id);

    const cuisineSupplier = new CuisineSupplier(pool);
    const supplier = new Supplier(pool);

    await cuisineSupplier.deleteBySupplierId(id);
    await supplier.delete(id);
    
    return res.send({message: 'Supplier deleted.'});
  }
};