import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { staffEquipmentController } from './equipment';

jest.mock('superstruct');

jest.mock('../../elasticsearch-access/EquipmentSearch', () => {
  const originalModule = jest
  .requireActual('../../elasticsearch-access/EquipmentSearch');
  return {
    ...originalModule,
    EquipmentSearch: jest.fn().mockImplementation(() => ({
      saveEquipment: mockSaveEquipment
    }))
  };
});
let mockSaveEquipment = jest.fn();

jest.mock('../../mysql-access/Equipment', () => {
  const originalModule = jest.requireActual('../../mysql-access/Equipment');
  return {
    ...originalModule,
    Equipment: jest.fn().mockImplementation(() => ({
      getEquipmentForElasticSearchInsert: mockGetEquipmentForElasticSearchInsert,
      createEquipment: mockCreateEquipment,
      updateEquipment: mockUpdateEquipment,
      deleteEquipment: mockDeleteEquipment
    }))
  };
});
let mockGetEquipmentForElasticSearchInsert = jest.fn().mockResolvedValue(
  [[{equipment_id: 5432}]]
);
let mockCreateEquipment = jest.fn().mockResolvedValue({insertId: 5432});
let mockUpdateEquipment = jest.fn();
let mockDeleteEquipment = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

//