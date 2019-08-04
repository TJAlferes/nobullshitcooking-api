const pool = require('../lib/connections/mysqlPoolConnection');
const Method = require('../mysql-access/Method');
const validMethodRequest = require('../lib/validations/method/methodRequest');

const methodController = {
  viewAllMethods: async function(req, res, next) {
    try {
      const method = new Method(pool);
      const rows = await method.viewAllMethods();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewMethodById: async function(req, res, next) {
    try {
      const methodId = Number(req.sanitize(req.params.methodId));
      validMethodRequest({methodId});
      const method = new Method(pool);
      const [ row ] = await method.viewMethodById(methodId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = methodController;