import { Request, Response } from 'express';

import { staffCuisineEquipmentController } from '../../../../src/controllers/staff/cuisineEquipment';

jest.mock('../../../../src/mysql-access/CuisineEquipment', () => {
  const originalModule =
    jest.requireActual('../../../../src/mysql-access/CuisineEquipment');
  return {
    ...originalModule,
    CuisineEquipment: jest.fn().mockImplementation(() => ({
      create: mockCreate,
      delete: mockDelete
    }))
  };
});
let mockCreate = jest.fn();
let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff cuisine equipment controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: 15}};

  describe('create method', () => {
    const req: Partial<Request> =
      {session, body: {cuisineId: 4, equipmentId: 4}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Cuisine equipment created.'})
    };

    it('uses create correctly', async () => {
      await staffCuisineEquipmentController.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineEquipmentController.create(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith({message: 'Cuisine equipment created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineEquipmentController
        .create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine equipment created.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> =
      {session, body: {cuisineId: 4, equipmentId: 4}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Cuisine equipment deleted.'})
    };

    it('uses delete correctly', async () => {
      await staffCuisineEquipmentController.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineEquipmentController.delete(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith({message: 'Cuisine equipment deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineEquipmentController
        .delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine equipment deleted.'});
    });
  });

});