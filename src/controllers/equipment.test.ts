import { Request, Response } from 'express';

import { equipmentController } from './equipment';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/Equipment', () => ({
  Equipment: jest.fn().mockImplementation(() => ({
    viewEquipment: mockViewEquipment,
    viewEquipmentById: mockViewEquipmentById
  }))
}));
let mockViewEquipment = jest.fn().mockResolvedValue([rows]);
let mockViewEquipmentById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('equipment controller', () => {
  describe('viewEquipment method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewEquipment correctly', async () => {
      await equipmentController.viewEquipment(<Request>{}, <Response>res);
      expect(mockViewEquipment).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await equipmentController.viewEquipment(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await equipmentController
      .viewEquipment(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewEquipmentById method', () => {
    const req: Partial<Request> = {params: {equipmentId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewEquipmentById correctly', async () => {
      await equipmentController
      .viewEquipmentById(<Request>req, <Response>res);
      expect(mockViewEquipmentById).toHaveBeenCalledWith(1, 1, 1);
    });

    it('sends data correctly', async () => {
      await equipmentController
      .viewEquipmentById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await equipmentController
      .viewEquipmentById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});