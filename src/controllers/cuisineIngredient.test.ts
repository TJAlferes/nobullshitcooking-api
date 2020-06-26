import { Request, Response } from 'express';

import { cuisineIngredientController } from './cuisineIngredient';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/CuisineIngredient', () => ({
  CuisineIngredient: jest.fn().mockImplementation(() => ({
    viewCuisineIngredientsByCuisineId: mockViewCuisineIngredientsByCuisineId
  }))
}));
let mockViewCuisineIngredientsByCuisineId = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineIngredient controller', () => {
  describe('viewCuisineIngredientsByCuisineId method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewCuisineIngredientsByCuisineId correctly', async () => {
      await cuisineIngredientController
      .viewCuisineIngredientsByCuisineId(<Request>req, <Response>res);
      expect(mockViewCuisineIngredientsByCuisineId).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await cuisineIngredientController
      .viewCuisineIngredientsByCuisineId(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineIngredientController
      .viewCuisineIngredientsByCuisineId(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});