import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import {
  StaffEquipmentController
} from '../../../../src/controllers/staff/equipment';
import {
  validEquipmentEntity
} from '../../../../src/lib/validations/equipment/entity';

jest.mock('superstruct');

const esClient: Partial<Client> = {};
const pool: Partial<Pool> = {};
const controller = new StaffEquipmentController(<Client>esClient, <Pool>pool);

jest.mock('../../../../src/access/elasticsearch/EquipmentSearch', () => ({
  EquipmentSearch: jest.fn().mockImplementation(() => ({
    save: mockESSave,
    delete: mockESDelete
  }))
}));
let mockESSave = jest.fn();
let mockESDelete = jest.fn();

jest.mock('../../../../src/access/mysql/Equipment', () => ({
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
      await controller.create(<Request>req, <Response>res);
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
      await controller.create(<Request>req, <Response>res);
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
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment created.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
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
      await controller.update(<Request>req, <Response>res);
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
      await controller.update(<Request>req, <Response>res);
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
      await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment updated.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 321}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment deleted.'})};

    it('uses delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(321);
    });

    it('uses ElasticSearch delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockESDelete).toHaveBeenCalledWith(String(321));
    });

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment deleted.'});
    });
  });

});