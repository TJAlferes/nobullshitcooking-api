import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineController } from '../../../src/controllers/cuisine';

const pool: Partial<Pool> = {};
const controller = new CuisineController(<Pool>pool);

const rows = [{name: "Name"}];
jest.mock('../../../src/access/mysql/Cuisine', () => ({
  Cuisine: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewByName: mockviewByName,
    viewDetailByName: mockViewDetailByName
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockviewByName =jest.fn().mockResolvedValue([rows]);
let mockViewDetailByName = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisine controller', () => {
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
      expect(mockviewByName).toHaveBeenCalledWith(1);
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

  describe('viewDetailByName method', () => {
    const req: Partial<Request> = {params: {name: "Name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewDetailByName correctly', async () => {
      await controller.viewDetailByName(<Request>req, <Response>res);
      expect(mockViewDetailByName).toHaveBeenCalledWith("Name");
    });

    it('sends data correctly', async () => {
      await controller.viewDetailByName(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual =
        await controller.viewDetailByName(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});