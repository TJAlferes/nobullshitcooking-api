import { Request, Response } from 'express';

import { methodController } from './method';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/Method', () => ({
  Method: jest.fn().mockImplementation(() => ({
    viewMethods: mockViewMethods,
    viewMethodById: mockViewMethodById
  }))
}));
let mockViewMethods = jest.fn().mockResolvedValue([rows]);
let mockViewMethodById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('method controller', () => {
  describe('viewMethods method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewMethods correctly', async () => {
      await methodController.viewMethods(<Request>{}, <Response>res);
      expect(mockViewMethods).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await methodController.viewMethods(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await methodController
      .viewMethods(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewMethodById method', () => {
    const req: Partial<Request> = {params: {methodId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewMethodById correctly', async () => {
      await methodController
      .viewMethodById(<Request>req, <Response>res);
      expect(mockViewMethodById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await methodController
      .viewMethodById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await methodController
      .viewMethodById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});