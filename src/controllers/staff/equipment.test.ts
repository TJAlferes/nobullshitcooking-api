import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validEquipmentEntity
} from '../../lib/validations/equipment/equipmentEntity';
import { staffEquipmentController } from './equipment';

jest.mock('superstruct');

jest.mock('../../elasticsearch-access/EquipmentSearch', () => {
  const originalModule = jest
  .requireActual('../../elasticsearch-access/EquipmentSearch');
  return {
    ...originalModule,
    EquipmentSearch: jest.fn().mockImplementation(() => ({
      saveEquipment: mockSaveEquipment,
      deleteEquipment: mockESDeleteEquipment
    }))
  };
});
let mockSaveEquipment = jest.fn();
let mockESDeleteEquipment = jest.fn();

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
  [[{equipment_id: 321}]]
);
let mockCreateEquipment = jest.fn().mockResolvedValue({insertId: 321});
let mockUpdateEquipment = jest.fn();
let mockDeleteEquipment = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff equipment controller', () => {
  const session = {...<Express.Session>{}, userInfo: {staffId: 15}};

  describe('createEquipment method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          equipmentTypeId: 3,
          equipmentName: "My Equipment",
          equipmentDescription: "Some description.",
          equipmentImage: "some-image"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Equipment created.'})
    };

    it('uses assert correctly', async () => {
      await staffEquipmentController
      .createEquipment(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          equipmentTypeId: 3,
          authorId: 1,
          ownerId: 1,
          equipmentName: "My Equipment",
          equipmentDescription: "Some description.",
          equipmentImage: "some-image"
        },
        validEquipmentEntity
      );
    });

    it('uses createEquipment correctly', async () => {
      await staffEquipmentController
      .createEquipment(<Request>req, <Response>res);
      expect(mockCreateEquipment).toBeCalledWith({
        equipmentTypeId: 3,
        authorId: 1,
        ownerId: 1,
        equipmentName: "My Equipment",
        equipmentDescription: "Some description.",
        equipmentImage: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffEquipmentController
      .createEquipment(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Equipment created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffEquipmentController
      .createEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment created.'});
    });
  });

  describe('updateEquipment method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          equipmentId: 321,
          equipmentTypeId: 3,
          equipmentName: "My Equipment",
          equipmentDescription: "Some description.",
          equipmentImage: "some-image"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Equipment updated.'})
    };

    it('uses assert correctly', async () => {
      await staffEquipmentController
      .updateEquipment(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          equipmentTypeId: 3,
          authorId: 1,
          ownerId: 1,
          equipmentName: "My Equipment",
          equipmentDescription: "Some description.",
          equipmentImage: "some-image"
        },
        validEquipmentEntity
      );
    });

    it('uses updateEquipment correctly', async () => {
      await staffEquipmentController
      .updateEquipment(<Request>req, <Response>res);
      expect(mockUpdateEquipment).toBeCalledWith({
        equipmentId: 321,
        equipmentTypeId: 3,
        authorId: 1,
        ownerId: 1,
        equipmentName: "My Equipment",
        equipmentDescription: "Some description.",
        equipmentImage: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffEquipmentController
      .updateEquipment(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Equipment updated.'});
    });

    it('returns correctly', async () => {
      const actual = await staffEquipmentController
      .updateEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment updated.'});
    });
  });

  describe('deleteEquipment method', () => {
    const req: Partial<Request> = {session, body: {equipmentId: 321}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Equipment deleted.'})
    };

    it('uses deleteEquipment correctly', async () => {
      await staffEquipmentController
      .deleteEquipment(<Request>req, <Response>res);
      expect(mockDeleteEquipment).toBeCalledWith(321);
    });

    it('uses ElasticSearch deleteEquipment correctly', async () => {
      await staffEquipmentController
      .deleteEquipment(<Request>req, <Response>res);
      expect(mockESDeleteEquipment).toBeCalledWith(String(321));
    });

    it('sends data correctly', async () => {
      await staffEquipmentController
      .deleteEquipment(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Equipment deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffEquipmentController
      .deleteEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment deleted.'});
    });
  });

});