import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validRecipeTypeRequest
} from '../lib/validations/recipeType/recipeTypeRequest';
import { recipeTypeController } from './recipeType';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/RecipeType', () => ({
  RecipeType: jest.fn().mockImplementation(() => ({
    viewRecipeTypes: mockViewRecipeTypes,
    viewRecipeTypeById: mockViewRecipeTypesById
  }))
}));
let mockViewRecipeTypes = jest.fn().mockResolvedValue([rows]);
let mockViewRecipeTypesById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('recipeType controller', () => {
  describe('viewRecipeTypes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewRecipeTypes correctly', async () => {
      await recipeTypeController.viewRecipeTypes(<Request>{}, <Response>res);
      expect(mockViewRecipeTypes).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
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
    const req: Partial<Request> = {params: {recipeTypeId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses assert correctly', async () => {
      await recipeTypeController
      .viewRecipeTypeById(<Request>req, <Response>res);
      expect(assert)
      .toHaveBeenCalledWith({recipeTypeId: 1}, validRecipeTypeRequest);
    });

    it('uses viewRecipeTypeById', async () => {
      await recipeTypeController
      .viewRecipeTypeById(<Request>req, <Response>res);
      expect(mockViewRecipeTypesById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
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