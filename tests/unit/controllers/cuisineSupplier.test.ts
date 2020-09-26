import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import {
  CuisineSupplierController
} from '../../../src/controllers/cuisineSupplier';

const pool: Partial<Pool> = {};
const controller = new CuisineSupplierController(<Pool>pool);

const rows: any = [{id: 1, name: "Name"}];
jest.mock('../../../src/mysql-access/CuisineSupplier', () => ({
  CuisineSupplier: jest.fn().mockImplementation(() => ({
    viewByCuisineId: mockViewByCuisineId
  }))
}));
let mockViewByCuisineId = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineSupplier controller', () => {
  describe('viewByCuisineId method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewByCuisineId correctly', async () => {
      await controller.viewByCuisineId(<Request>req, <Response>res);
      expect(mockViewByCuisineId).toHaveBeenCalledWith(1);
    });

    it('sends data', async () => {
      await controller.viewByCuisineId(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await controller
        .viewByCuisineId(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});