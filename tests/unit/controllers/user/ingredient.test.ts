import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import {
  UserIngredientController
} from '../../../../src/controllers/user/ingredient';
import {
  validIngredientEntity
} from '../../../../src/lib/validations/ingredient/entity';

const pool: Partial<Pool> = {};
const controller = new UserIngredientController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql/Ingredient', () => ({
  Ingredient: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewById: mockViewById,
    create: mockCreate,
    update: mockUpdate,
    deleteByOwner: mockDeleteByOwner
  }))
}));
let mockView = jest.fn().mockResolvedValue(
  [[{id: "Name My Ingredient 1"}, {id: "Name My Ingredient 2"}]]
);
let mockViewById = jest.fn().mockResolvedValue(
  [[{id: "Name My Ingredient 2"}]]
);
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockDeleteByOwner = jest.fn();

jest.mock('../../../../src/access/mysql/RecipeIngredient', () => ({
  RecipeIngredient: jest.fn().mockImplementation(() => ({
    deleteByIngredient: mockDeleteByIngredient
  }))
}));
let mockDeleteByIngredient = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user ingredient controller', () => {
  const session = {...<Express.Session>{}, userInfo: {username: "Name"}};

  describe('view method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{id: "Name My Ingredient 1"}, {id: "Name My Ingredient 2"}]]
      )
    };

    it('uses view correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith("Name", "Name");
    });

    it('sends data correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(
        [[{id: "Name My Ingredient 1"}, {id: "Name My Ingredient 2"}]]
      );
    });

    it('returns correctly', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(actual).toEqual(
        [[{id: "Name My Ingredient 1"}, {id: "Name My Ingredient 2"}]]
      );
    });
  });

  describe('viewById method', () => {
    const req: Partial<Request> = {session, body: {id: "Name My Ingredient 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: "Name My Ingredient 2"}])};

    it('uses viewById correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockViewById)
        .toHaveBeenCalledWith("Name My Ingredient 2", "Name", "Name");
    });

    it('sends data correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: "Name My Ingredient 2"}]);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: "Name My Ingredient 2"}]);
    });
  });

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          type: "Type",
          brand: "Brand",
          variety: "Variety",
          name: "My Ingredient",
          description: "Tasty.",
          image: "nobsc-ingredient-default"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Ingredient created.'})
    };

    it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          type: "Type",
          author: "Name",
          owner: "Name",
          brand: "Brand",
          variety: "Variety",
          name: "My Ingredient",
          description: "Tasty.",
          image: "nobsc-ingredient-default"
        },
        validIngredientEntity
      );
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        type: "Type",
        author: "Name",
        owner: "Name",
        brand: "Brand",
        variety: "Variety",
        name: "My Ingredient",
        description: "Tasty.",
        image: "nobsc-ingredient-default"
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
          id: "Name My Ingredient 2",
          type: "Type",
          brand: "Brand",
          variety: "Variety",
          name: "My Ingredient",
          description: "Tasty.",
          image: "nobsc-ingredient-default"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Ingredient updated.'})};

    it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          type: "Type",
          author: "Name",
          owner: "Name",
          brand: "Brand",
          variety: "Variety",
          name: "My Ingredient",
          description: "Tasty.",
          image: "nobsc-ingredient-default"
        },
        validIngredientEntity
      );
    });

    it('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: "Name My Ingredient 2",
        type: "Type",
        author: "Name",
        owner: "Name",
        brand: "Brand",
        variety: "Variety",
        name: "My Ingredient",
        description: "Tasty.",
        image: "nobsc-ingredient-default"
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
    const req: Partial<Request> = {session, body: {id: "Name My Ingredient 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Ingredient deleted.'})};

    it('uses deleteByIngredient correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteByIngredient)
        .toHaveBeenCalledWith("Name My Ingredient 2");
    });

    it('uses deleteByOwner correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteByOwner)
        .toHaveBeenCalledWith("Name My Ingredient 2", "Name");
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