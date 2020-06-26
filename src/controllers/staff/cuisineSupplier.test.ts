import { Request, Response } from 'express';

import { staffCuisineSupplierController } from './cuisineSupplier';

jest.mock('../../mysql-access/CuisineSupplier', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/CuisineSupplier');
  return {
    ...originalModule,
    CuisineSupplier: jest.fn().mockImplementation(() => ({
      createCuisineSupplier: mockCreateCuisineSupplier,
      deleteCuisineSupplier: mockDeleteCuisineSupplier
    }))
  };
});
let mockCreateCuisineSupplier = jest.fn();
let mockDeleteCuisineSupplier = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff cuisine supplier controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {staffId: 15}};

  describe('createCuisineSupplier method', () => {
    const req: Partial<Request> = {
      session,
      body: {cuisineId: 4, supplierId: 4}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({
        message: 'Cuisine supplier created.'
      })
    };

    it('uses createCuisineSupplier correctly', async () => {
      await staffCuisineSupplierController
      .createCuisineSupplier(<Request>req, <Response>res);
      expect(mockCreateCuisineSupplier).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineSupplierController
      .createCuisineSupplier(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Cuisine supplier created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineSupplierController
      .createCuisineSupplier(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine supplier created.'});
    });
  });

  describe('deleteCuisineSupplier method', () => {
    const req: Partial<Request> = {
      session,
      body: {cuisineId: 4, supplierId: 4}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({
        message: 'Cuisine supplier deleted.'
      })
    };

    it('uses deleteCuisineSupplier correctly', async () => {
      await staffCuisineSupplierController
      .deleteCuisineSupplier(<Request>req, <Response>res);
      expect(mockDeleteCuisineSupplier).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineSupplierController
      .deleteCuisineSupplier(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Cuisine supplier deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineSupplierController
      .deleteCuisineSupplier(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine supplier deleted.'});
    });
  });

});