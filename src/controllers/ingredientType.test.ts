import { Request, Response } from 'express';

import { ingredientTypeController } from './ingredientType';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/IngredientType', () => ({
  IngredientType: jest.fn().mockImplementation(() => ({
    viewIngredientTypes: mockViewIngredientTypes,
    viewIngredientTypeById: mockViewIngredientTypeById
  }))
}));
let mockViewIngredientTypes = jest.fn().mockResolvedValue([rows]);
let mockViewIngredientTypeById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('ingredientType controller', () => {
  describe('viewIngredientTypes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewIngredientTypes correctly', async () => {
      await ingredientTypeController
      .viewIngredientTypes(<Request>{}, <Response>res);
      expect(mockViewIngredientTypes).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await ingredientTypeController
      .viewIngredientTypes(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await ingredientTypeController
      .viewIngredientTypes(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewIngredientTypeById method', () => {
    const req: Partial<Request> = {params: {ingredientTypeId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewIngredientTypeId correctly', async () => {
      await ingredientTypeController
      .viewIngredientTypeById(<Request>req, <Response>res);
      expect(mockViewIngredientTypeById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
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