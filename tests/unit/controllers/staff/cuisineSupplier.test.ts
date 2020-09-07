import { Request, Response } from 'express';

import {
  staffCuisineSupplierController
} from '../../../../src/controllers/staff/cuisineSupplier';

jest.mock('../../../../src/mysql-access/CuisineSupplier', () => ({
  CuisineSupplier: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    delete: mockDelete
  }))
}));
let mockCreate = jest.fn();
let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff cuisine supplier controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: 15}};

  describe('create method', () => {
    const req: Partial<Request> =
      {session, body: {cuisineId: 4, supplierId: 4}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Cuisine supplier created.'})
    };

    it('uses create correctly', async () => {
      await staffCuisineSupplierController.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineSupplierController.create(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith({message: 'Cuisine supplier created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineSupplierController
        .create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine supplier created.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> =
      {session, body: {cuisineId: 4, supplierId: 4}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Cuisine supplier deleted.'})
    };

    it('uses delete correctly', async () => {
      await staffCuisineSupplierController.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineSupplierController.delete(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith({message: 'Cuisine supplier deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineSupplierController
        .delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine supplier deleted.'});
    });
  });

});