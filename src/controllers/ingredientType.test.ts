import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { IngredientType } from '../mysql-access/IngredientType';
import { ingredientTypeController } from './ingredientType';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/IngredientType', () => ({
  IngredientType: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewIngredientTypes: jest.fn().mockResolvedValue([rows]),
      viewIngredientTypeById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('ingredientType controller', () => {
  describe('viewIngredientTypes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses IngredientType mysql access', async () => {
      await ingredientTypeController.viewIngredientTypes(<Request>{}, <Response>res);
      const MockedIngredientType = mocked(IngredientType, true);
      expect(MockedIngredientType).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await ingredientTypeController.viewIngredientTypes(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await ingredientTypeController
      .viewIngredientTypes(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewIngredientTypeById method', () => {
    const req: Partial<Request> = {params: {ingredientId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses validation', async () => {
      await ingredientTypeController
      .viewIngredientTypeById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses IngredientType mysql access', async () => {
      await ingredientTypeController
      .viewIngredientTypeById(<Request>req, <Response>res);
      const MockedIngredientType = mocked(IngredientType, true);
      expect(MockedIngredientType).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await ingredientTypeController
      .viewIngredientTypeById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await ingredientTypeController
      .viewIngredientTypeById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});