import { Request, Response } from 'express';

import { cuisineSupplierController } from './cuisineSupplier';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/CuisineSupplier', () => ({
  CuisineSupplier: jest.fn().mockImplementation(() => ({
    viewCuisineSuppliersByCuisineId: mockViewCuisineSuppliersByCuisineId
  }))
}));
let mockViewCuisineSuppliersByCuisineId = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineSupplier controller', () => {
  describe('viewCuisineSuppliersByCuisineId method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewCuisineSuppliersByCuisineId correctly', async () => {
      await cuisineSupplierController
      .viewCuisineSuppliersByCuisineId(<Request>req, <Response>res);
      expect(mockViewCuisineSuppliersByCuisineId).toHaveBeenCalledWith(1);
    });

    it('sends data', async () => {
      await cuisineSupplierController
      .viewCuisineSuppliersByCuisineId(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineSupplierController
      .viewCuisineSuppliersByCuisineId(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});