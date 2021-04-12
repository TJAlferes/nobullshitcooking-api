import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { ContentController } from '../../../src/controllers';

const pool: Partial<Pool> = {};
const controller = new ContentController(<Pool>pool);

const rows = [{id: "Name Title"}];
jest.mock('../../../src/access/mysql', () => ({
  Content: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewById: mockViewById,
    getLinksByType: mockGetLinksByType
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockViewById = jest.fn().mockResolvedValue([rows]);
let mockGetLinksByType = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('content controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view correctly', async () => {
      await controller.view(<Request>{}, <Response>res);
      expect(mockView).toHaveBeenCalledWith(1);
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
    const req: Partial<Request> = {params: {id: "NOBSC Title"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewById correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith("NOBSC Title", "NOBSC");
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

  describe('getLinksByType method', () => {
    const req: Partial<Request> = {params: {name: "Name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses getLinksByType correctly', async () => {
      await controller.getLinksByType(<Request>req, <Response>res);
      expect(mockGetLinksByType).toHaveBeenCalledWith("Name");
    });

    it('sends data', async () => {
      await controller.getLinksByType(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual =
        await controller.getLinksByType(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});