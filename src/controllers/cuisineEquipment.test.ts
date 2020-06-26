import { Request, Response } from 'express';

import { cuisineEquipmentController } from './cuisineEquipment';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/CuisineEquipment', () => ({
  CuisineEquipment: jest.fn().mockImplementation(() => ({
    viewCuisineEquipmentByCuisineId: mockViewCuisineEquipmentByCuisineId
  }))
}));
let mockViewCuisineEquipmentByCuisineId = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineEquipment controller', () => {
  describe('viewCuisineEquipmentByCuisineId method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewCuisineEquipmentByCuisineId correctly', async () => {
      await cuisineEquipmentController
      .viewCuisineEquipmentByCuisineId(<Request>req, <Response>res);
      expect(mockViewCuisineEquipmentByCuisineId).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await cuisineEquipmentController
      .viewCuisineEquipmentByCuisineId(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineEquipmentController
      .viewCuisineEquipmentByCuisineId(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});