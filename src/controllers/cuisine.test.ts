import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Cuisine } from '../mysql-access/Cuisine';
import { cuisineController } from './cuisine';

const rows: any = [{cuisine_id: 1, cuisine_name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/Cuisine', () => ({
  Cuisine: jest.fn().mockImplementation(() => {
    const rows: any = [{cuisine_id: 1, cuisine_name: "Name"}];
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
    it('works', async () => {
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue([rows])
      };

      const actual = await cuisineController
      .viewCuisines(<Request>{}, <Response>res);

      expect(actual).toEqual([rows]);

      const MockedCuisine = mocked(Cuisine, true);

      expect(MockedCuisine).toHaveBeenCalledTimes(1);
    });
  });
  describe('viewCuisineById method', () => {
    it('works', async () => {
      const req: Partial<Request> = {params: {cuisineId: "1"}};
      const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

      const actual = await cuisineController
      .viewCuisineById(<Request>req, <Response>res);

      expect(actual).toEqual(rows);

      const MockedAssert = mocked(assert, true);

      expect(MockedAssert).toHaveBeenCalledTimes(1);

      const MockedCuisine = mocked(Cuisine, true);

      expect(MockedCuisine).toHaveBeenCalledTimes(1);
    });
  });
  describe('viewCuisineDetailById method', () => {
    it('works', async () => {
      const req: Partial<Request> = {params: {cuisineId: "1"}};
      const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

      const actual = await cuisineController
      .viewCuisineDetailById(<Request>req, <Response>res);

      expect(actual).toEqual(rows);

      const MockedAssert = mocked(assert, true);

      expect(MockedAssert).toHaveBeenCalledTimes(1);

      const MockedCuisine = mocked(Cuisine, true);

      expect(MockedCuisine).toHaveBeenCalledTimes(1);
    });
  });
});