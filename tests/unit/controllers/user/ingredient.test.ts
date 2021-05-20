import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { UserIngredientController } from '../../../../src/controllers/user';
import { validIngredient } from '../../../../src/lib/validations/entities';

const pool: Partial<Pool> = {};
const controller = new UserIngredientController(<Pool>pool);

jest.mock('superstruct');

const row = [{id: 1}];
const rows = [[{id: 1}, {id: 2}]];
jest.mock('../../../../src/access/mysql', () => ({
  Ingredient: jest.fn().mockImplementation(() => ({
    view, viewById, create, update, deleteById
  })),
  RecipeIngredient: jest.fn().mockImplementation(() => ({deleteByIngredientId}))
}));
let view = jest.fn().mockResolvedValue(rows);
let viewById = jest.fn().mockResolvedValue([row]);
let create = jest.fn();
let update = jest.fn();
let deleteById = jest.fn();
let deleteByIngredientId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user ingredient controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 1}};

  describe('view method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses view', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(view).toHaveBeenCalledWith(1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });

  describe('viewById method', () => {
    const req: Partial<Request> = {session, body: {id: 1}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(row)};

    it('uses viewById', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(viewById).toHaveBeenCalledWith(1, 1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(row);
      expect(actual).toEqual(row);
    });
  });

  describe('create method', () => {
    const args = {
      ingredientTypeId: 1,
      authorId: 1,
      ownerId: 1,
      brand: "Brand",
      variety: "Variety",
      name: "Name",
      description: "Description.",
      image: "image"
    };
    const message = 'Ingredient created.';
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
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validIngredient);
    });

    it('uses create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(create).toHaveBeenCalledWith(args);
    });

    it('returns sent data', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('update method', () => {
    const args = {
      ingredientTypeId: 1,
      authorId: 1,
      ownerId: 1,
      brand: "Brand",
      variety: "Variety",
      name: "Name",
      description: "Description.",
      image: "image"
    };
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
      expect(update).toHaveBeenCalledWith(args);
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
      expect(deleteByIngredientId).toHaveBeenCalledWith(1);
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