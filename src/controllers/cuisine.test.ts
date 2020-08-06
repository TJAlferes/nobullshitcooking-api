import { Request, Response } from 'express';

import { cuisineController } from './cuisine';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/Cuisine', () => ({
  Cuisine: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewById: mockViewById,
    viewDetailById: mockViewDetailById
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockViewById =jest.fn().mockResolvedValue([rows]);
let mockViewDetailById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisine controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view correctly', async () => {
      await cuisineController.view(<Request>{}, <Response>res);
      expect(mockView).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await cuisineController.view(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineController.view(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewById method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewById correctly', async () => {
      await cuisineController.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await cuisineController.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual =
        await cuisineController.viewById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });

  describe('viewDetailById method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewDetailById correctly', async () => {
      await cuisineController.viewDetailById(<Request>req, <Response>res);
      expect(mockViewDetailById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await cuisineController.viewDetailById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual =
        await cuisineController.viewDetailById(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});