import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { UserIngredientController } from '../../../../src/controllers/user';
import { validIngredient } from '../../../../src/lib/validations/entities';

const pool: Partial<Pool> = {};
const controller = new UserIngredientController(<Pool>pool);

jest.mock('superstruct');

const row = {id: 1, name: "Name"};
const rows = [{id: 1, name: "Name"}, {id: 2, name: "Name"}];
jest.mock('../../../../src/access/mysql', () => ({
  Ingredient: jest.fn().mockImplementation(() => ({
    view: mockview,
    viewById: mockviewById,
    create: mockcreate,
    update: mockupdate,
    deleteById: mockdeleteById
  })),
  RecipeIngredient: jest.fn().mockImplementation(() => ({
    deleteByIngredientId: mockdeleteByIngredientId
  }))
}));
let mockview = jest.fn().mockResolvedValue(rows);
let mockviewById = jest.fn().mockResolvedValue([row]);
let mockcreate = jest.fn();
let mockupdate = jest.fn();
let mockdeleteById = jest.fn();
let mockdeleteByIngredientId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user ingredient controller', () => {
  const ingredientInfo = {
    ingredientTypeId: 1,
    brand: "Brand",
    variety: "Variety",
    name: "Name",
    description: "Description.",
    image: "image"
  };
  const args = {authorId: 1, ownerId: 1, ...ingredientInfo};
  const session = {...<Express.Session>{}, userInfo: {id: 1}};

  describe('view method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses view', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockview).toHaveBeenCalledWith(1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });

  describe('viewById method', () => {
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(row)};

    it('uses viewById', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockviewById).toHaveBeenCalledWith(1, 1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(row);
      expect(actual).toEqual(row);
    });
  });

  describe('create method', () => {
    const message = 'Ingredient created.';
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo
      }
    };
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

    it('returns sent data', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('update method', () => {
    const message = 'Ingredient updated.';
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          ingredientTypeId: 1,
          brand: "Brand",
          variety: "Variety",
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
      expect(assert).toHaveBeenCalledWith(args, validIngredient);
    });

    it('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockupdate).toHaveBeenCalledWith({id: 1, ...args});
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