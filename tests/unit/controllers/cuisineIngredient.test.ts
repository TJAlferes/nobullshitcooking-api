import { Request, Response } from 'express';

import { cuisineIngredientController } from '../../../src/controllers/cuisineIngredient';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../../../src/mysql-access/CuisineIngredient', () => ({
  CuisineIngredient: jest.fn().mockImplementation(() => ({
    viewByCuisineId: mockViewByCuisineId
  }))
}));
let mockViewByCuisineId = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineIngredient controller', () => {
  describe('viewByCuisineId method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewByCuisineId correctly', async () => {
      await cuisineIngredientController
        .viewByCuisineId(<Request>req, <Response>res);
      expect(mockViewByCuisineId).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await cuisineIngredientController
        .viewByCuisineId(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineIngredientController
        .viewByCuisineId(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});