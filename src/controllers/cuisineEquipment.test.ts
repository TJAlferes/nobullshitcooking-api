import { Request, Response } from 'express';
//import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { CuisineEquipment } from '../mysql-access/CuisineEquipment';
import { cuisineEquipmentController } from './cuisineEquipment';

const rows: any = [{id: 1, name: "Name"}];

//jest.mock('superstruct');

jest.mock('../mysql-access/CuisineEquipment', () => ({
  CuisineEquipment: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewCuisineEquipmentByCuisineId: jest.fn().mockResolvedValue([rows]),
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineEquipment controller', () => {
  describe('viewCuisineEquipmentByCuisineId method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    /*it('uses validation', async () => {
      await cuisineEquipmentController
      .viewCuisineEquipmentByCuisineId(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });*/

    it('uses CuisineEquipment mysql access', async () => {
      await cuisineEquipmentController
      .viewCuisineEquipmentByCuisineId(<Request>req, <Response>res);
      const MockedCuisineEquipment = mocked(CuisineEquipment, true);
      expect(MockedCuisineEquipment).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await cuisineEquipmentController
      .viewCuisineEquipmentByCuisineId(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineEquipmentController
      .viewCuisineEquipmentByCuisineId(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});