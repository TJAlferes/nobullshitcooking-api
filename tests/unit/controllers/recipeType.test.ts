import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
//import { assert } from 'superstruct';

import { RecipeTypeController } from '../../../src/controllers/recipeType';
/*import {
  validRecipeTypeRequest
} from '../../../src/lib/validations/recipeType/request';*/

const pool: Partial<Pool> = {};
const controller = new RecipeTypeController(<Pool>pool);

const rows = [{name: "Name"}];
jest.mock('../../../src/access/mysql/RecipeType', () => ({
  RecipeType: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewByName: mockViewByName
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockViewByName = jest.fn().mockResolvedValue([rows]);

jest.mock('superstruct');

afterEach(() => {
  jest.clearAllMocks();
});

describe('recipeType controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view correctly', async () => {
      await controller.view(<Request>{}, <Response>res);
      expect(mockView).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await controller.view(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await controller.view(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewByName method', () => {
    const req: Partial<Request> = {params: {name: "Name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    /*it('uses assert correctly', async () => {
      await controller.viewByName(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith({name: "Name"}, validRecipeTypeRequest);
    });*/

    it('uses viewByName', async () => {
      await controller.viewByName(<Request>req, <Response>res);
      expect(mockViewByName).toHaveBeenCalledWith("Name");
    });

    it('sends data correctly', async () => {
      await controller.viewByName(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewByName(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});