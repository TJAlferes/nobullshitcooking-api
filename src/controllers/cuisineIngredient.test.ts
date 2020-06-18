import { Request, Response } from 'express';
//import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { CuisineIngredient } from '../mysql-access/CuisineIngredient';
import { cuisineIngredientController } from './cuisineIngredient';

const rows: any = [{id: 1, name: "Name"}];

//jest.mock('superstruct');

jest.mock('../mysql-access/CuisineIngredient', () => ({
  CuisineIngredient: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewCuisineIngredientsByCuisineId: jest.fn().mockResolvedValue([rows]),
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineIngredient controller', () => {
  describe('viewCuisineIngredientsByCuisineId method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    /*it('uses validation', async () => {
      await cuisineIngredientController
      .viewCuisineIngredientsByCuisineId(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });*/

    it('uses CuisineIngredient mysql access', async () => {
      await cuisineIngredientController
      .viewCuisineIngredientsByCuisineId(<Request>req, <Response>res);
      const MockedCuisineIngredient = mocked(CuisineIngredient, true);
      expect(MockedCuisineIngredient).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await cuisineIngredientController
      .viewCuisineIngredientsByCuisineId(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineIngredientController
      .viewCuisineIngredientsByCuisineId(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});