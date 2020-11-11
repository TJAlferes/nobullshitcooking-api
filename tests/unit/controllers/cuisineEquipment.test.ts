import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import {
  CuisineEquipmentController
} from '../../../src/controllers/cuisineEquipment';

const pool: Partial<Pool> = {};
const controller = new CuisineEquipmentController(<Pool>pool);

const rows = [{cuisine: "Name"}];
jest.mock('../../../src/access/mysql/CuisineEquipment', () => ({
  CuisineEquipment: jest.fn().mockImplementation(() => ({
    viewByCuisine: mockViewByCuisine
  }))
}));
let mockViewByCuisine = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineEquipment controller', () => {
  describe('viewByCuisine method', () => {
    const req: Partial<Request> = {params: {cuisine: "Name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewByCuisine correctly', async () => {
      await controller.viewByCuisine(<Request>req, <Response>res);
      expect(mockViewByCuisine).toHaveBeenCalledWith("Name");
    });

    it('sends data correctly', async () => {
      await controller.viewByCuisine(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual =
        await controller.viewByCuisine(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});