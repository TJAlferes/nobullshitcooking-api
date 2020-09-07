import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { recipeTypeController } from '../../../src/controllers/recipeType';
import {
  validRecipeTypeRequest
} from '../../../src/lib/validations/recipeType/request';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../../../src/mysql-access/RecipeType', () => ({
  RecipeType: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewById: mockViewById
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockViewById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('recipeType controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view correctly', async () => {
      await recipeTypeController.view(<Request>{}, <Response>res);
      expect(mockView).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await recipeTypeController.view(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual =
        await recipeTypeController.view(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewById method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses assert correctly', async () => {
      await recipeTypeController.viewById(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith({id: 1}, validRecipeTypeRequest);
    });

    it('uses viewById', async () => {
      await recipeTypeController.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await recipeTypeController.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual =
        await recipeTypeController.viewById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});