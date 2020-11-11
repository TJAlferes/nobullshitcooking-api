import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import {
  StaffIngredientController
} from '../../../../src/controllers/staff/ingredient';
import {
  validIngredientEntity
} from '../../../../src/lib/validations/ingredient/entity';

jest.mock('superstruct');

const esClient: Partial<Client> = {};
const pool: Partial<Pool> = {};
const controller = new StaffIngredientController(<Client>esClient, <Pool>pool);

jest.mock('../../../../src/access/elasticsearch/IngredientSearch', () => ({
  IngredientSearch: jest.fn().mockImplementation(() => ({
    save: mockESSave,
    delete: mockESDelete
  }))
}));
let mockESSave = jest.fn();
let mockESDelete = jest.fn();

jest.mock('../../../../src/access/mysql/Ingredient', () => ({
  Ingredient: jest.fn().mockImplementation(() => ({
    getForElasticSearch: mockGetForElasticSearch,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete
  }))
}));
let mockGetForElasticSearch =
  jest.fn().mockResolvedValue([[{id: "NOBSC Ingredient"}]]);
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff ingredient controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {staffname: "Name"}};

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          type: "Cooking",
          brand: "Brand",
          variety: "Variety",
          name: "Ingredient",
          description: "Description.",
          image: "image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Ingredient created.'})};

    it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          type: "Cooking",
          author: "NOBSC",
          owner: "NOBSC",
          brand: "Brand",
          variety: "Variety",
          name: "Ingredient",
          description: "Description.",
          image: "image"
        },
        validIngredientEntity
      );
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        type: "Cooking",
        author: "NOBSC",
        owner: "NOBSC",
        brand: "Brand",
        variety: "Variety",
        name: "Ingredient",
        description: "Description.",
        image: "image"
      });
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Ingredient created.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          id: "NOBSC Ingredient",
          type: "Cooking",
          brand: "Brand",
          variety: "Variety",
          name: "Ingredient",
          description: "Description.",
          image: "image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Ingredient updated.'})};

    it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          type: "Cooking",
          author: "NOBSC",
          owner: "NOBSC",
          brand: "Brand",
          variety: "Variety",
          name: "Ingredient",
          description: "Description.",
          image: "image"
        },
        validIngredientEntity
      );
    });

    it('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: "NOBSC Ingredient",
        type: "Cooking",
        author: "NOBSC",
        owner: "NOBSC",
        brand: "Brand",
        variety: "Variety",
        name: "Ingredient",
        description: "Description.",
        image: "image"
      });
    });

    it('sends data correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Ingredient updated.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: "NOBSC Ingredient"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Ingredient deleted.'})};

    it('uses delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith("NOBSC Ingredient");
    });

    it('uses ElasticSearch delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockESDelete).toHaveBeenCalledWith(String(321));
    });

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Ingredient deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient deleted.'});
    });
  });

});