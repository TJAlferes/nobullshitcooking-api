import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import {
  EquipmentTypeController
} from '../../../src/controllers/equipmentType';

const pool: Partial<Pool> = {};
const controller = new EquipmentTypeController(<Pool>pool);

const rows = [{id: 1, name: "Name"}];
jest.mock('../../../src/mysql-access/EquipmentType', () => ({
  EquipmentType: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewById: mockViewById
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockViewById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('equipmentType controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view correctly', async () => {
      await controller.view(<Request>{}, <Response>res);
      expect(mockView).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await controller.view(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await controller.view(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewById method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewById correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});