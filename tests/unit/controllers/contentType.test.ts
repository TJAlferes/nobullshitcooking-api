import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { ContentTypeController } from '../../../src/controllers';

const pool: Partial<Pool> = {};
const controller = new ContentTypeController(<Pool>pool);

const rows = [{id: 1, name: "Name"}];
jest.mock('../../../src/access/mysql', () => ({
  ContentType: jest.fn().mockImplementation(() => ({view, viewById}))
}));
let view = jest.fn().mockResolvedValue([rows]);
let viewById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('contentType controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view correctly', async () => {
      await controller.view(<Request>{}, <Response>res);
      expect(view).toHaveBeenCalledTimes(1);
    });

    it('returns sent rows', async () => {
      const actual = await controller.view(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewById method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewById correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(viewById).toHaveBeenCalledWith(1);
    });

    it('returns sent rows', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });
});