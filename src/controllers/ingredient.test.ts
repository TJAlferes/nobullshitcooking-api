import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Ingredient } from '../mysql-access/Ingredient';
import { ingredientController } from './ingredient';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/Ingredient', () => ({
  Ingredient: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewIngredients: jest.fn().mockResolvedValue([rows]),
      viewIngredientById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('ingredient controller', () => {
  describe('viewIngredients method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses Ingredient mysql access', async () => {
      await ingredientController.viewIngredients(<Request>{}, <Response>res);
      const MockedIngredient = mocked(Ingredient, true);
      expect(MockedIngredient).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await ingredientController.viewIngredients(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await ingredientController
      .viewIngredients(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewIngredientById method', () => {
    const req: Partial<Request> = {params: {ingredientId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses validation', async () => {
      await ingredientController
      .viewIngredientById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses Ingredient mysql access', async () => {
      await ingredientController
      .viewIngredientById(<Request>req, <Response>res);
      const MockedIngredient = mocked(Ingredient, true);
      expect(MockedIngredient).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await ingredientController
      .viewIngredientById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await ingredientController
      .viewIngredientById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});