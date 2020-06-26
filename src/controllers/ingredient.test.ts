import { Request, Response } from 'express';

import { ingredientController } from './ingredient';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/Ingredient', () => ({
  Ingredient: jest.fn().mockImplementation(() => ({
    viewIngredients: mockViewIngredients,
    viewIngredientById: mockViewIngredientById
  }))
}));
let mockViewIngredients = jest.fn().mockResolvedValue([rows]);
let mockViewIngredientById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('ingredient controller', () => {
  describe('viewIngredients method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewIngredients correctly', async () => {
      await ingredientController.viewIngredients(<Request>{}, <Response>res);
      expect(mockViewIngredients).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
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

    it('uses viewIngredientById correctly', async () => {
      await ingredientController
      .viewIngredientById(<Request>req, <Response>res);
      expect(mockViewIngredientById).toHaveBeenCalledWith(1, 1, 1);
    });

    it('sends data correctly', async () => {
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