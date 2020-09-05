import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validProductEntity
} from '../../../../src/lib/validations/product/productEntity';
import { staffProductController } from '../../../../src/controllers/staff/product';

jest.mock('superstruct');

jest.mock('../../../../src/elasticsearch-access/ProductSearch', () => {
  const originalModule =
    jest.requireActual('../../../../src/elasticsearch-access/ProductSearch');
  return {
    ...originalModule,
    ProductSearch: jest.fn().mockImplementation(() => ({
      save: mockESSave,
      delete: mockESDelete
    }))
  };
});
let mockESSave = jest.fn();
let mockESDelete = jest.fn();

jest.mock('../../../../src/mysql-access/Product', () => {
  const originalModule = jest.requireActual('../../../../src/mysql-access/Product');
  return {
    ...originalModule,
    Product: jest.fn().mockImplementation(() => ({
      getForElasticSearch: mockGetForElasticSearch,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete
    }))
  };
});
let mockGetForElasticSearch = jest.fn().mockResolvedValue([[{id: 321}]]);
let mockCreate = jest.fn().mockResolvedValue({insertId: 321});
let mockUpdate = jest.fn();
let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff product controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: 15}};

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        productInfo: {
          productTypeId: 3,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Product",
          description: "Some description.",
          specs: {},
          image: "some-image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Product created.'})};

    it('uses assert correctly', async () => {
      await staffProductController.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          productTypeId: 3,
          authorId: 1,
          ownerId: 1,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Product",
          description: "Some description.",
          specs: {},
          image: "some-image"
        },
        validProductEntity
      );
    });

    it('uses create correctly', async () => {
      await staffProductController.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        productTypeId: 3,
        authorId: 1,
        ownerId: 1,
        brand: "Some Brand",
        variety: "Some Variety",
        name: "My Product",
        description: "Some description.",
        specs: {},
        image: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffProductController.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Product created.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffProductController.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Product created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        productInfo: {
          id: 321,
          productTypeId: 3,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Product",
          description: "Some description.",
          specs: {},
          image: "some-image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Product updated.'})};

    it('uses assert correctly', async () => {
      await staffProductController.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          productTypeId: 3,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Product",
          description: "Some description.",
          specs: {},
          image: "some-image"
        },
        validProductEntity
      );
    });

    it('uses update correctly', async () => {
      await staffProductController.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: 321,
        productTypeId: 3,
        brand: "Some Brand",
        variety: "Some Variety",
        name: "My Product",
        description: "Some description.",
        specs: {},
        image: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffProductController.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Product updated.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffProductController.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Product updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 321}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Product deleted.'})};

    it('uses delete correctly', async () => {
      await staffProductController.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(321);
    });

    it('uses ElasticSearch delete correctly', async () => {
      await staffProductController.delete(<Request>req, <Response>res);
      expect(mockESDelete).toHaveBeenCalledWith(String(321));
    });

    it('sends data correctly', async () => {
      await staffProductController.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Product deleted.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffProductController.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Product deleted.'});
    });
  });

});