import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const Cuisine = require('../mysql-access/Cuisine');
const validCuisineRequest = require('../lib/validations/cuisine/cuisineRequest');

const cuisineController = {
  viewAllCuisines: async function(req: Request, res: Response) {
    const cuisine = new Cuisine(pool);
    const rows = await cuisine.viewAllCuisines();
    res.send(rows);
  },
  viewCuisineById: async function(req: Request, res: Response) {
    const cuisineId = Number(req.params.cuisineId);
    validCuisineRequest({cuisineId});
    //if (cuisineId < 1 || cuisineId > 196) return res.send('invalid cuisine');
    const cuisine = new Cuisine(pool);
    const [ row ] = await cuisine.viewCuisineById(cuisineId);
    res.send(row);
  },
  viewCuisineDetailById: async function(req: Request, res: Response) {
    const cuisineId = Number(req.params.cuisineId);
    validCuisineRequest({cuisineId});
    const cuisine = new Cuisine(pool);
    const detail = await cuisine.viewCuisineDetailById(cuisineId);
    res.send(detail);
  },
};

module.exports = cuisineController;