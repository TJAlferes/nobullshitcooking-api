import { Request, Response } from 'express';
//import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { CuisineSupplier } from '../mysql-access/CuisineSupplier';
import { cuisineSupplierController } from './cuisineSupplier';

const rows: any = [{id: 1, name: "Name"}];

//jest.mock('superstruct');

jest.mock('../mysql-access/CuisineSupplier', () => ({
  CuisineSupplier: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewCuisineSuppliersByCuisineId: jest.fn().mockResolvedValue([rows]),
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineSupplier controller', () => {
  describe('viewCuisineSuppliersByCuisineId method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    /*it('uses validation', async () => {
      await cuisineSupplierController
      .viewCuisineSuppliersByCuisineId(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });*/

    it('uses CuisineSupplier mysql access', async () => {
      await cuisineSupplierController
      .viewCuisineSuppliersByCuisineId(<Request>req, <Response>res);
      const MockedCuisineEquipment = mocked(CuisineSupplier, true);
      expect(MockedCuisineEquipment).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await cuisineSupplierController
      .viewCuisineSuppliersByCuisineId(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineSupplierController
      .viewCuisineSuppliersByCuisineId(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});