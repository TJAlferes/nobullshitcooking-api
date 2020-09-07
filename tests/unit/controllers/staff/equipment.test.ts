import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  staffEquipmentController
} from '../../../../src/controllers/staff/equipment';
import {
  validEquipmentEntity
} from '../../../../src/lib/validations/equipment/entity';

jest.mock('superstruct');

jest.mock('../../../../src/elasticsearch-access/EquipmentSearch', () => ({
  EquipmentSearch: jest.fn().mockImplementation(() => ({
    save: mockESSave,
    delete: mockESDelete
  }))
}));
let mockESSave = jest.fn();
let mockESDelete = jest.fn();

jest.mock('../../../../src/mysql-access/Equipment', () => ({
  Equipment: jest.fn().mockImplementation(() => ({
    getForElasticSearch: mockGetForElasticSearch,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete
  }))
}));
let mockGetForElasticSearch = jest.fn().mockResolvedValue([[{id: 321}]]);
let mockCreate = jest.fn().mockResolvedValue({insertId: 321});
let mockUpdate = jest.fn();
let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff equipment controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: 15}};

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          equipmentTypeId: 3,
          name: "My Equipment",
          description: "Some description.",
          image: "some-image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment created.'})};

    it('uses assert correctly', async () => {
      await staffEquipmentController.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          equipmentTypeId: 3,
          authorId: 1,
          ownerId: 1,
          name: "My Equipment",
          description: "Some description.",
          image: "some-image"
        },
        validEquipmentEntity
      );
    });

    it('uses create correctly', async () => {
      await staffEquipmentController.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        equipmentTypeId: 3,
        authorId: 1,
        ownerId: 1,
        name: "My Equipment",
        description: "Some description.",
        image: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffEquipmentController.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment created.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffEquipmentController.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          id: 321,
          equipmentTypeId: 3,
          name: "My Equipment",
          description: "Some description.",
          image: "some-image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment updated.'})};

    it('uses assert correctly', async () => {
      await staffEquipmentController.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          equipmentTypeId: 3,
          authorId: 1,
          ownerId: 1,
          name: "My Equipment",
          description: "Some description.",
          image: "some-image"
        },
        validEquipmentEntity
      );
    });

    it('uses update correctly', async () => {
      await staffEquipmentController.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: 321,
        equipmentTypeId: 3,
        authorId: 1,
        ownerId: 1,
        name: "My Equipment",
        description: "Some description.",
        image: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffEquipmentController.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment updated.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffEquipmentController.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 321}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment deleted.'})};

    it('uses delete correctly', async () => {
      await staffEquipmentController.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(321);
    });

    it('uses ElasticSearch delete correctly', async () => {
      await staffEquipmentController.delete(<Request>req, <Response>res);
      expect(mockESDelete).toHaveBeenCalledWith(String(321));
    });

    it('sends data correctly', async () => {
      await staffEquipmentController.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment deleted.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffEquipmentController.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment deleted.'});
    });
  });

});