import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import {
  StaffProductController
} from '../../../../src/controllers/staff/product';
import {
  validProductEntity
} from '../../../../src/lib/validations/product/entity';

jest.mock('superstruct');

const esClient: Partial<Client> = {};
const pool: Partial<Pool> = {};
const controller = new StaffProductController(<Client>esClient, <Pool>pool);

jest.mock('../../../../src/access/elasticsearch/ProductSearch', () => ({
  ProductSearch: jest.fn().mockImplementation(() => ({
    save: mockESSave,
    delete: mockESDelete
  }))
}));
let mockESSave = jest.fn();
let mockESDelete = jest.fn();

jest.mock('../../../../src/access/mysql/Product', () => ({
  Product: jest.fn().mockImplementation(() => ({
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

const productCreation = {
  productCategoryId: 3,
  productTypeId: 3,
  brand: "Some Brand",
  variety: "Some Variety",
  name: "My Product",
  altNames: [],
  description: "Some description.",
  specs: {},
  image: "some-image"
};
const productUpdate = {id: 321, ...productCreation};

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff product controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: 15}};

  describe('create method', () => {
    const req: Partial<Request> =
      {session, body: {productInfo: productCreation}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Product created.'})};

    it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(productCreation, validProductEntity);
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith(productCreation);
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Product created.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Product created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {session, body: {productInfo: productUpdate}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Product updated.'})};

    it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(productCreation, validProductEntity);
    });

    it('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({id: 321, ...productCreation});
    });

    it('sends data correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Product updated.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Product updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 321}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Product deleted.'})};

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
      expect(res.send).toHaveBeenCalledWith({message: 'Product deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Product deleted.'});
    });
  });

});