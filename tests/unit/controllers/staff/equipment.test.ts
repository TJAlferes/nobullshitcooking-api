import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { StaffEquipmentController } from '../../../../src/controllers/staff';
import { validEquipment } from '../../../../src/lib/validations/entities';

jest.mock('superstruct');

const esClient: Partial<Client> = {};
const pool: Partial<Pool> = {};
const controller = new StaffEquipmentController(<Client>esClient, <Pool>pool);

jest.mock('../../../../src/access/elasticsearch', () => ({
  EquipmentSearch: jest.fn().mockImplementation(() => ({
    save: ESSave, delete: ESDelete
  }))
}));
let ESSave = jest.fn();
let ESDelete = jest.fn();

const toSave =
  {id: "1", equipment_type_name: "Name", name: "Name", image: "image"};
jest.mock('../../../../src/access/mysql', () => ({
  Equipment: jest.fn().mockImplementation(() => ({
    getForElasticSearchById, create, update, deleteById
  })),
  RecipeEquipment: jest.fn().mockImplementation(() => ({deleteByEquipmentId}))
}));
let getForElasticSearchById = jest.fn().mockResolvedValue(toSave);
let create = jest.fn().mockResolvedValue({generatedId: 1});
let update = jest.fn();
let deleteById = jest.fn();
let deleteByEquipmentId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff equipment controller', () => {
  const args = {
    equipmentTypeId: 1,
    authorId: 1,
    ownerId: 1,
    name: "Name",
    description: "Description.",
    image: "image"
  };
  const session = {...<Express.Session>{}, staffInfo: {id: 1}};

  describe('create method', () => {
    const message = 'Equipment created.';
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          equipmentTypeId: 1,
          name: "Name",
          description: "Description.",
          image: "image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validEquipment);
    });

    it('uses create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(create).toHaveBeenCalledWith(args);
    });

    it('uses getForElasticSearchById', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(getForElasticSearchById).toHaveBeenCalledWith(1);
    });

    it('uses ElasticSearch save', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(ESSave).toHaveBeenCalledWith(toSave);
    });

    it('returns sent data', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('update method', () => {
    const message = 'Equipment updated.';
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          id: 1,
          equipmentTypeId: 1,
          name: "Name",
          description: "Description.",
          image: "image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validEquipment);
    });

    it('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(update).toHaveBeenCalledWith({id: 1, ...args});
    });

    it('uses getForElasticSearchById', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(getForElasticSearchById).toHaveBeenCalledWith(1);
    });

    it('uses ElasticSearch save', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(ESSave).toHaveBeenCalledWith(toSave);
    });

    it('returns sent data', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('delete method', () => {
    const message = 'Equipment deleted.';
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses ElasticSearch delete', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(ESDelete).toHaveBeenCalledWith("1");
    });

    it('uses RecipeEquipment deleteByEquipmentId', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(deleteByEquipmentId).toHaveBeenCalledWith(1);
    });

    it('uses deleteById', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(deleteById).toHaveBeenCalledWith(1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });
});