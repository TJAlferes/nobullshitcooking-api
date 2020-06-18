import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Recipe } from '../mysql-access/Recipe';
import { recipeController } from './recipe';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewRecipes: jest.fn().mockResolvedValue([rows]),
      viewRecipeById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('recipe controller', () => {
  describe('viewRecipes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses Recipe mysql access', async () => {
      await recipeController.viewRecipes(<Request>{}, <Response>res);
      const MockedRecipe = mocked(Recipe, true);
      expect(MockedRecipe).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await recipeController.viewRecipes(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await recipeController
      .viewRecipes(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewRecipeDetail method', () => {
    const req: Partial<Request> = {params: {recipeId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses validation', async () => {
      await recipeController
      .viewRecipeDetail(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses Recipe mysql access', async () => {
      await recipeController
      .viewRecipeDetail(<Request>req, <Response>res);
      const MockedRecipe = mocked(Recipe, true);
      expect(MockedRecipe).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await recipeController
      .viewRecipeDetail(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await recipeController
      .viewRecipeDetail(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});