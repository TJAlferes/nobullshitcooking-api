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
    view: mockView,
    viewById: mockViewById
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockViewById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('recipe controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view correctly', async () => {
      await recipeController.view(<Request>{}, <Response>res);
      expect(mockView).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await recipeController.view(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await recipeController.view(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewById method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses assert correctly', async () => {
      await recipeController.viewById(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith({recipeId: 1}, validRecipeRequest);
    });

    it('uses viewById correctly', async () => {
      await recipeController.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(1, 1, 1);
    });

    it('sends data correctly', async () => {
      await recipeController.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual =
        await recipeController.viewById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});