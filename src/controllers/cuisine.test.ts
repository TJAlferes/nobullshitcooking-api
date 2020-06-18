import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Cuisine } from '../mysql-access/Cuisine';
import { cuisineController } from './cuisine';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/Cuisine', () => ({
  Cuisine: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewCuisines: jest.fn().mockResolvedValue([rows]),
      viewCuisineById: jest.fn().mockResolvedValue([rows]),
      viewCuisineDetailById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisine controller', () => {
  describe('viewCuisines method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses Cuisine mysql access', async () => {
      await cuisineController.viewCuisines(<Request>{}, <Response>res);
      const MockedCuisine = mocked(Cuisine, true);
      expect(MockedCuisine).toHaveBeenCalledTimes(1);
    });

    it('uses res.send', async () => {
      await cuisineController.viewCuisines(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineController
      .viewCuisines(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewCuisineById method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses validation', async () => {
      await cuisineController.viewCuisineById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses Cuisine mysql access', async () => {
      await cuisineController.viewCuisineById(<Request>req, <Response>res);
      const MockedCuisine = mocked(Cuisine, true);
      expect(MockedCuisine).toHaveBeenCalledTimes(1);
    });

    it('uses res.send', async () => {
      await cuisineController.viewCuisineById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await cuisineController
      .viewCuisineById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });

  describe('viewCuisineDetailById method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses validation', async () => {
      await cuisineController
      .viewCuisineDetailById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses Cuisine mysql access', async () => {
      await cuisineController
      .viewCuisineDetailById(<Request>req, <Response>res);
      const MockedCuisine = mocked(Cuisine, true);
      expect(MockedCuisine).toHaveBeenCalledTimes(1);
    });

    it('uses res.send', async () => {
      await cuisineController
      .viewCuisineDetailById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineController
      .viewCuisineDetailById(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});