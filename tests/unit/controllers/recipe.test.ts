import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { RecipeController } from '../../../src/controllers';

const pool: Partial<Pool> = {};
const controller = new RecipeController(<Pool>pool);

const rows = [{id: 1, name: "Name"}];
jest.mock('../../../src/access/mysql', () => ({
  Recipe: jest.fn().mockImplementation(() => ({view, viewById}))
}));
let view = jest.fn().mockResolvedValue([rows]);
let viewById = jest.fn().mockResolvedValue([rows]);

jest.mock('superstruct');

afterEach(() => {
  jest.clearAllMocks();
});

describe('recipe controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view', async () => {
      await controller.view(<Request>{}, <Response>res);
      expect(view).toHaveBeenCalledTimes(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.view(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewById method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewById', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(viewById).toHaveBeenCalledWith(1, 1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });
});