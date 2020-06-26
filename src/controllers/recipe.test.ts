import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validRecipeRequest
} from '../lib/validations/recipe/recipeRequest';
import { recipeController } from './recipe';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => ({
    viewRecipes: mockViewRecipes,
    viewRecipeById: mockViewRecipeById
  }))
}));
let mockViewRecipes = jest.fn().mockResolvedValue([rows]);
let mockViewRecipeById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('recipe controller', () => {
  describe('viewRecipes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewRecipes correctly', async () => {
      await recipeController.viewRecipes(<Request>{}, <Response>res);
      expect(mockViewRecipes).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
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

    it('uses assert correctly', async () => {
      await recipeController
      .viewRecipeDetail(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith({recipeId: 1}, validRecipeRequest);
    });

    it('uses viewRecipeById correctly', async () => {
      // inconsistent naming... please fix...
      await recipeController
      .viewRecipeDetail(<Request>req, <Response>res);
      expect(mockViewRecipeById).toHaveBeenCalledWith(1, 1, 1);
    });

    it('sends data correctly', async () => {
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