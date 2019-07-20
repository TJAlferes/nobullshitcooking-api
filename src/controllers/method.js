const pool = require('../data-access/dbPoolConnection');  // move?
const Method = require('../data-access/Method');
const validMethodRequest = require('../lib/validations/methodRequest');

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
      const methodId = req.sanitize(req.params.methodId);
      validMethodRequest({methodId}); //if (methodId < 1 || methodId > 12) throw new Error('invalid method');
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