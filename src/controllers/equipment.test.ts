import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Equipment } from '../mysql-access/Equipment';
import { equipmentController } from './equipment';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/Equipment', () => ({
  Equipment: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewEquipment: jest.fn().mockResolvedValue([rows]),
      viewEquipmentById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('equipment controller', () => {
  describe('viewEquipment method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses Equipment mysql access', async () => {
      await equipmentController.viewEquipment(<Request>{}, <Response>res);
      const MockedEquipment = mocked(Equipment, true);
      expect(MockedEquipment).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
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

    it('uses validation', async () => {
      await equipmentController
      .viewEquipmentById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses Equipment mysql access', async () => {
      await equipmentController
      .viewEquipmentById(<Request>req, <Response>res);
      const MockedEquipment = mocked(Equipment, true);
      expect(MockedEquipment).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
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