const pool = require('../../lib/connections/mysqlPoolConnection');
const CuisineSupplier = require('../../mysql-access/CuisineSupplier');
const Supplier = require('../../mysql-access/Supplier');

const staffSupplierController = {
  createSupplier: async function (req, res) {
    const supplierName = req.santize(req.body.supplierInfo.supplierName);

    // TO DO: validate

    const supplier = new Supplier(pool);
    const [ row ] = await supplier.createSupplier(supplierName);
    res.send(row);
  },
  updateSupplier: async function (req, res) {
    const supplierId = Number(req.santize(req.body.supplierInfo.supplierId));
    const supplierName = req.santize(req.body.supplierInfo.supplierName);

    // TO DO: validate
    const supplierToUpdateWith = {supplierName};

    const supplier = new Supplier(pool);

    const [ row ] = await supplier
    .updateSupplier(supplierToUpdateWith, supplierId);

    res.send(row);
  },
  deleteSupplier: async function (req, res) {
    const supplierId = Number(req.santize(req.body.supplierInfo.supplierId));

    const cuisineSupplier = new CuisineSupplier(pool);
    await cuisineSupplier.deleteCuisineSuppliersBySupplierId(supplierId);

    const supplier = new Supplier(pool);
    const [ row ] = await supplier.deleteSupplier(supplierId);
    
    res.send(row);
  }
};

module.exports = staffSupplierController;