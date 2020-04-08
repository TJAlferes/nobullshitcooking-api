import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { CuisineSupplier } from '../../mysql-access/CuisineSupplier';
import { Supplier } from '../../mysql-access/Supplier';

export const staffSupplierController = {
  viewAllSuppliers: async function (req: Request, res: Response) {
    const supplier = new Supplier(pool);

    const allFoundSuppliers = await supplier.viewAllSuppliers();

    res.send({suppliers: allFoundSuppliers});
  },

  viewSupplierById: async function (req: Request, res: Response) {
    const supplierId = Number(req.body.supplierInfo.supplierId);

    const supplier = new Supplier(pool);

    const foundSupplier = await supplier.viewSupplierById(supplierId);

    res.send({supplier: foundSupplier});
  },

  createSupplier: async function (req: Request, res: Response) {
    const supplierName = req.body.supplierInfo.supplierName;

    // TO DO: validate
    
    const supplier = new Supplier(pool);

    await supplier.createSupplier(supplierName);

    res.send({message: 'Supplier created.'});
  },

  updateSupplier: async function (req: Request, res: Response) {
    const supplierId = Number(req.body.supplierInfo.supplierId);
    const supplierName = req.body.supplierInfo.supplierName;

    // TO DO: validate

    const supplierToUpdateWith = {supplierName};

    const supplier = new Supplier(pool);

    await supplier.updateSupplier(supplierToUpdateWith, supplierId);

    res.send({message: 'Supplier updated.'});
  },
  
  deleteSupplier: async function (req: Request, res: Response) {
    const supplierId = Number(req.body.supplierInfo.supplierId);

    const cuisineSupplier = new CuisineSupplier(pool);

    await cuisineSupplier.deleteCuisineSuppliersBySupplierId(supplierId);

    const supplier = new Supplier(pool);

    await supplier.deleteSupplier(supplierId);
    
    res.send({message: 'Supplier deleted.'});
  }
};