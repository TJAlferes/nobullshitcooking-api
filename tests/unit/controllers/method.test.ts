import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { MethodController } from '../../../src/controllers/method';

const pool: Partial<Pool> = {};
const controller = new MethodController(<Pool>pool);

const rows = [{name: "Name"}];
jest.mock('../../../src/access/mysql/Method', () => ({
  Method: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewByName: mockViewByName
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockViewByName = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('method controller', () => {
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
  
  describe('viewByName method', () => {
    const req: Partial<Request> = {params: {name: "Name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewByName correctly', async () => {
      await controller.viewByName(<Request>req, <Response>res);
      expect(mockViewByName).toHaveBeenCalledWith("Name");
    });

    it('sends data correctly', async () => {
      await controller.viewByName(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewByName(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});