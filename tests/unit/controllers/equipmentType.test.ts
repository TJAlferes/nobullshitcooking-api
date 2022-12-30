import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { EquipmentTypeController } from '../../../src/controllers';

const pool: Partial<Pool> = {};
const controller = new EquipmentTypeController(<Pool>pool);

const row = {id: 1, name: "Name"};
const rows = [{id: 1, name: "Name"}, {id: 2, name: "Name"}];
jest.mock('../../../src/access/mysql', () => ({
  EquipmentType: jest.fn().mockImplementation(() => ({view: mockview, viewById: mockviewById}))
}));
let mockview =     jest.fn().mockResolvedValue(rows);
let mockviewById = jest.fn().mockResolvedValue([row]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('equipmentType controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses view', async () => {
      await controller.view(<Request>{}, <Response>res);
      expect(mockview).toHaveBeenCalledTimes(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.view(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });
  
  describe('viewById method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(row)};

    it('uses viewById', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockviewById).toHaveBeenCalledWith(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(row);
      expect(actual).toEqual(row);
    });
  });
});