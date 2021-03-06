import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { StaffIngredientController } from '../../../../src/controllers/staff';
import { validIngredient } from '../../../../src/lib/validations/entities';

jest.mock('superstruct');

const esClient: Partial<Client> = {};
const pool: Partial<Pool> = {};
const controller = new StaffIngredientController(<Client>esClient, <Pool>pool);

jest.mock('../../../../src/access/elasticsearch', () => ({
  IngredientSearch: jest.fn().mockImplementation(() => ({
    save: ESSave, delete: ESDelete
  }))
}));
let ESSave = jest.fn();
let ESDelete = jest.fn();

const toSave = {
  id: "1",
  ingredient_type_name: "Name",
  fullname: "Brand Variety Name",
  brand: "Brand",
  variety: "Variety",
  name: "Name",
  image: "image"
};
jest.mock('../../../../src/access/mysql', () => ({
  Ingredient: jest.fn().mockImplementation(() => ({
    getForElasticSearchById: mockgetForElasticSearchById,
    create: mockcreate,
    update: mockupdate,
    deleteById: mockdeleteById
  })),
  RecipeIngredient: jest.fn().mockImplementation(() => ({
    deleteByIngredientId: mockdeleteByIngredientId
  }))
}));
let mockgetForElasticSearchById = jest.fn().mockResolvedValue(toSave);
let mockcreate = jest.fn().mockResolvedValue({generatedId: 1});
let mockupdate = jest.fn();
let mockdeleteById = jest.fn();
let mockdeleteByIngredientId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff ingredient controller', () => {
  const ingredientInfo = {
    ingredientTypeId: 1,
    brand: "Brand",
    variety: "Variety",
    name: "Name",
    description: "Description.",
    image: "image"
  };
  const args = {authorId: 1, ownerId: 1, ...ingredientInfo};
  const session = {...<Express.Session>{}, staffInfo: {id: 1}};

  describe('create method', () => {
    const message = 'Ingredient created.';
    const req: Partial<Request> = {session, body: {ingredientInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validIngredient);
    });

    it('uses create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockcreate).toHaveBeenCalledWith(args);
    });

    it('uses getForElasticSearchById', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockgetForElasticSearchById).toHaveBeenCalledWith(1);
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
    const message = 'Ingredient updated.';
    const req: Partial<Request> = {session, body: {id: 1, ...ingredientInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validIngredient);
    });

    it('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockupdate).toHaveBeenCalledWith({id: 1, ...args});
    });

    it('uses getForElasticSearchById', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockgetForElasticSearchById).toHaveBeenCalledWith(1);
    });

    it('uses ElasticSearch save', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(ESSave).toHaveBeenCalledWith(toSave);
    });

    it('returns sent data', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('delete method', () => {
    const message = 'Ingredient deleted.';
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses ElasticSearch delete', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(ESDelete).toHaveBeenCalledWith(String(1));
    });

    it('uses RecipeIngredient deleteByIngredientId', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockdeleteByIngredientId).toHaveBeenCalledWith(1);
    });

    it('uses deleteById', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockdeleteById).toHaveBeenCalledWith(1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });
});