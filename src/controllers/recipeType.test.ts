import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { RecipeType } from '../mysql-access/RecipeType';
import { recipeTypeController } from './recipeType';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/RecipeType', () => ({
  RecipeType: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewRecipeTypes: jest.fn().mockResolvedValue([rows]),
      viewRecipeTypeById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('recipeType controller', () => {
  describe('viewRecipeTypes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses RecipeType mysql access', async () => {
      await recipeTypeController.viewRecipeTypes(<Request>{}, <Response>res);
      const MockedRecipeType = mocked(RecipeType, true);
      expect(MockedRecipeType).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await recipeTypeController.viewRecipeTypes(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await recipeTypeController
      .viewRecipeTypes(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewRecipeTypeById method', () => {
    const req: Partial<Request> = {params: {recipeId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses validation', async () => {
      await recipeTypeController
      .viewRecipeTypeById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses RecipeType mysql access', async () => {
      await recipeTypeController
      .viewRecipeTypeById(<Request>req, <Response>res);
      const MockedRecipeType = mocked(RecipeType, true);
      expect(MockedRecipeType).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await recipeTypeController
      .viewRecipeTypeById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await recipeTypeController
      .viewRecipeTypeById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});