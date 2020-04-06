import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const Method = require('../mysql-access/Method');
const validMethodRequest = require('../lib/validations/method/methodRequest');

const methodController = {
  viewAllMethods: async function(req: Request, res: Response) {
    const method = new Method(pool);
    const rows = await method.viewAllMethods();
    res.send(rows);
  },
  viewMethodById: async function(req: Request, res: Response) {
    const methodId = Number(req.sanitize(req.params.methodId));
    validMethodRequest({methodId});
    const method = new Method(pool);
    const [ row ] = await method.viewMethodById(methodId);
    res.send(row);
  }
};

module.exports = methodController;