import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { StaffProductController } from '../../../../src/controllers/staff';
import { validProduct } from '../../../../src/lib/validations/entities';

jest.mock('superstruct');

const esClient: Partial<Client> = {};
const pool: Partial<Pool> = {};
const controller = new StaffProductController(<Client>esClient, <Pool>pool);

jest.mock('../../../../src/access/elasticsearch', () => ({
  ProductSearch: jest.fn().mockImplementation(() => ({
    save: ESSave, delete: ESDelete
  }))
}));
let ESSave = jest.fn();
let ESDelete = jest.fn();

const toSave = {
  id: "1",
  product_category_name: "Name",
  product_type_name: "Name",
  fullname: "Brand Variety Name",
  brand: "Brand",
  variety: "Variety",
  name: "Name",
  description: "Description.",
  specs: "{specs}",
  image: "image"
};
jest.mock('../../../../src/access/mysql', () => ({
  Product: jest.fn().mockImplementation(() => ({
    getForElasticSearchById, create, update, delete: mockDelete
  }))
}));
let getForElasticSearchById = jest.fn().mockResolvedValue(toSave);
let create = jest.fn();
let update = jest.fn();
let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff product controller', () => {
  const args = {
    productCategoryId: 1,
    productTypeId: 1,
    brand: "Brand",
    variety: "Variety",
    name: "Product",
    altNames: [],
    description: "Description.",
    specs: {},
    image: "image"
  };
  const session = {...<Express.Session>{}, staffInfo: {id: 1}};

  describe('create method', () => {
    const message = 'Product created.';
    const req: Partial<Request> =
      {session, body: {productInfo: args}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validProduct);
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
    const message = 'Product updated.';
    const req: Partial<Request> =
      {session, body: {productInfo: {id: 1, ...args}}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validProduct);
    });

    it('uses update ', async () => {
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
    const message = 'Product deleted.'
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses ElasticSearch delete', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(ESDelete).toHaveBeenCalledWith("1");
    });

    it('uses delete', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });
});