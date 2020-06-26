import { Request, Response } from 'express';

import { staffCuisineEquipmentController } from './cuisineEquipment';

jest.mock('../../mysql-access/CuisineEquipment', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/CuisineEquipment');
  return {
    ...originalModule,
    CuisineEquipment: jest.fn().mockImplementation(() => ({
      createCuisineEquipment: mockCreateCuisineEquipment,
      deleteCuisineEquipment: mockDeleteCuisineEquipment
    }))
  };
});
let mockCreateCuisineEquipment = jest.fn();
let mockDeleteCuisineEquipment = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff cuisine equipment controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {staffId: 15}};

  describe('createCuisineEquipment method', () => {
    const req: Partial<Request> = {
      session,
      body: {cuisineId: 4, equipmentId: 4}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Cuisine equipment created.'})
    };

    it('uses createCuisineEquipment correctly', async () => {
      await staffCuisineEquipmentController
      .createCuisineEquipment(<Request>req, <Response>res);
      expect(mockCreateCuisineEquipment).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineEquipmentController
      .createCuisineEquipment(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Cuisine equipment created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineEquipmentController
      .createCuisineEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine equipment created.'});
    });
  });

  describe('deleteCuisineEquipment method', () => {
    const req: Partial<Request> = {
      session,
      body: {cuisineId: 4, equipmentId: 4}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Cuisine equipment deleted.'})
    };

    it('uses deleteCuisineEquipment correctly', async () => {
      await staffCuisineEquipmentController
      .deleteCuisineEquipment(<Request>req, <Response>res);
      expect(mockDeleteCuisineEquipment).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineEquipmentController
      .deleteCuisineEquipment(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Cuisine equipment deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineEquipmentController
      .deleteCuisineEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine equipment deleted.'});
    });
  });

});