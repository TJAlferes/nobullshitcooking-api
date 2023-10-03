import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { cuisineController } from '../../../src/modules/recipe/cuisine/controller';

const pool: Partial<Pool> = {};
//const controller = new CuisineController(<Pool>pool);
const controller = cuisineController;

const row = {id: 1, name: "Name"};
const rows = [{id: 1, name: "Name"}, {id: 2, name: "Name"}];
jest.mock('../../../src/access/mysql', () => ({
  Cuisine: jest.fn().mockImplementation(() => ({viewAll: mockviewAll, viewOne: mockviewOne}))
}));
let mockviewAll = jest.fn().mockResolvedValue(rows);
let mockviewOne = jest.fn().mockResolvedValue(row);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisine controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses view', async () => {
      await controller.viewAll(<Request>{}, <Response>res);
      expect(mockviewAll).toHaveBeenCalledTimes(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.viewAll(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });
  
  describe('viewOne method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(row)};

    it('uses viewOne', async () => {
      await controller.viewOne(<Request>req, <Response>res);
      expect(mockviewOne).toHaveBeenCalledWith(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.viewOne(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(row);
      expect(actual).toEqual(row);
    });
  });
});