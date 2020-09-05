import { Request, Response } from 'express';

import { cuisineEquipmentController } from '../../../src/controllers/cuisineEquipment';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../../../src/mysql-access/CuisineEquipment', () => ({
  CuisineEquipment: jest.fn().mockImplementation(() => ({
    viewByCuisineId: mockViewByCuisineId
  }))
}));
let mockViewByCuisineId = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisineEquipment controller', () => {
  describe('viewByCuisineId method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewByCuisineId correctly', async () => {
      await cuisineEquipmentController
        .viewByCuisineId(<Request>req, <Response>res);
      expect(mockViewByCuisineId).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await cuisineEquipmentController
        .viewByCuisineId(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineEquipmentController
        .viewByCuisineId(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});