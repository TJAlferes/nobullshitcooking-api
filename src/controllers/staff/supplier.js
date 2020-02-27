const pool = require('../../lib/connections/mysqlPoolConnection');

const CuisineSupplier = require('../../mysql-access/CuisineSupplier');
const Supplier = require('../../mysql-access/Supplier');

const staffSupplierController = {
  viewAllSuppliers: async function (req, res) {
    const supplier = new Supplier(pool);

    await supplier.viewAllSuppliers();

    res.send({suppliers});
  },

  viewSupplierById: async function (req, res) {
    const supplierId = Number(req.santize(req.body.supplierInfo.supplierId));

    const supplier = new Supplier(pool);

    await supplier.viewSupplierById(supplierId);

    res.send({supplier});
  },

  createSupplier: async function (req, res) {
    const supplierName = req.santize(req.body.supplierInfo.supplierName);

    // TO DO: validate
    
    const supplier = new Supplier(pool);

    await supplier.createSupplier(supplierName);

    res.send({message: 'Supplier created.'});
  },

  updateSupplier: async function (req, res) {
    const supplierId = Number(req.santize(req.body.supplierInfo.supplierId));
    const supplierName = req.santize(req.body.supplierInfo.supplierName);

    // TO DO: validate

    const supplierToUpdateWith = {supplierName};

    const supplier = new Supplier(pool);

    await supplier.updateSupplier(supplierToUpdateWith, supplierId);

    res.send({message: 'Supplier updated.'});
  },
  
  deleteSupplier: async function (req, res) {
    const supplierId = Number(req.santize(req.body.supplierInfo.supplierId));

    const cuisineSupplier = new CuisineSupplier(pool);

    await cuisineSupplier.deleteCuisineSuppliersBySupplierId(supplierId);

    const supplier = new Supplier(pool);

    await supplier.deleteSupplier(supplierId);
    
    res.send({message: 'Supplier deleted.'});
  }
};

module.exports = staffSupplierController;