import { Request, Response } from 'express';

import { equipmentTypeController } from './equipmentType';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/EquipmentType', () => ({
  EquipmentType: jest.fn().mockImplementation(() => ({
    viewEquipmentTypes: mockViewEquipmentTypes,
    viewEquipmentTypeById: mockViewEquipmentTypeById
  }))
}));
let mockViewEquipmentTypes = jest.fn().mockResolvedValue([rows]);
let mockViewEquipmentTypeById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('equipmentType controller', () => {
  describe('viewEquipmentTypes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewEquipmentTypes correctly', async () => {
      await equipmentTypeController
      .viewEquipmentTypes(<Request>{}, <Response>res);
      expect(mockViewEquipmentTypes).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await equipmentTypeController
      .viewEquipmentTypes(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await equipmentTypeController
      .viewEquipmentTypes(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewEquipmentTypeById method', () => {
    const req: Partial<Request> = {params: {equipmentTypeId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewEquipmentTypeById correctly', async () => {
      await equipmentTypeController
      .viewEquipmentTypeById(<Request>req, <Response>res);
      expect(mockViewEquipmentTypeById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await equipmentTypeController
      .viewEquipmentTypeById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await equipmentTypeController
      .viewEquipmentTypeById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});