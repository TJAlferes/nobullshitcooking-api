import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { EquipmentType } from '../mysql-access/EquipmentType';
import { equipmentTypeController } from './equipmentType';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/EquipmentType', () => ({
  EquipmentType: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewEquipmentTypes: jest.fn().mockResolvedValue([rows]),
      viewEquipmentTypeById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('equipmentType controller', () => {
  describe('viewEquipmentTypes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses EquipmentType mysql access', async () => {
      await equipmentTypeController
      .viewEquipmentTypes(<Request>{}, <Response>res);
      const MockedEquipmentType = mocked(EquipmentType, true);
      expect(MockedEquipmentType).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
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

    it('uses validation', async () => {
      await equipmentTypeController
      .viewEquipmentTypeById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses EquipmentType mysql access', async () => {
      await equipmentTypeController
      .viewEquipmentTypeById(<Request>req, <Response>res);
      const MockedEquipmentType = mocked(EquipmentType, true);
      expect(MockedEquipmentType).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
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