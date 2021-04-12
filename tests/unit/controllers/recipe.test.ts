import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
//import { assert } from 'superstruct';

import { RecipeController } from '../../../src/controllers';
/*import {
  validRecipeRequest
} from '../../../src/lib/validations/recipe/recipeRequest';*/

const pool: Partial<Pool> = {};
const controller = new RecipeController(<Pool>pool);

const rows = [{id: "NOBSC Title"}];
jest.mock('../../../src/access/mysql', () => ({
  Recipe: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewById: mockViewById
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockViewById = jest.fn().mockResolvedValue([rows]);

jest.mock('superstruct');

afterEach(() => {
  jest.clearAllMocks();
});

describe('recipe controller', () => {
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
  
  describe('viewById method', () => {
    const req: Partial<Request> = {params: {id: "NOBSC Title"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    /*it('uses assert correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith({id: "NOBSC Title"}, validRecipeRequest);
    });*/

    it('uses viewById correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockViewById)
        .toHaveBeenCalledWith("NOBSC Title", "NOBSC", "NOBSC");
    });

    it('sends data correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});