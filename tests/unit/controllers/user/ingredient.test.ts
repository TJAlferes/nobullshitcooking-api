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
    deleteByOwnerId: mockDeleteByOwnerId
  }))
}));
let mockView = jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]]);
let mockViewById = jest.fn().mockResolvedValue([[{id: 5432}]]);
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockDeleteByOwnerId = jest.fn();

jest.mock('../../../../src/access/mysql/RecipeIngredient', () => ({
  RecipeIngredient: jest.fn().mockImplementation(() => ({
    deleteByIngredientId: mockDeleteByIngredientId
  }))
}));
let mockDeleteByIngredientId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user ingredient controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 150}};

  describe('view method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]])};

    it('uses view correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith(150, 150);
    });

    it('sends data correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([[{id: 383}, {id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: 383}, {id: 5432}]]);
    });
  });

  describe('viewById method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: 5432}])};

    it('uses viewById correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: 5432}]);
    });
  });

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          ingredientTypeId: 2,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Ingredient",
          description: "It works.",
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
          ingredientTypeId: 2,
          authorId: 150,
          ownerId: 150,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Ingredient",
          description: "It works.",
          image: "nobsc-ingredient-default"
        },
        validIngredientEntity
      );
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        ingredientTypeId: 2,
        authorId: 150,
        ownerId: 150,
        brand: "Some Brand",
        variety: "Some Variety",
        name: "My Ingredient",
        description: "It works.",
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
          id: 5432,
          ingredientTypeId: 2,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Ingredient",
          description: "It works.",
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
          ingredientTypeId: 2,
          authorId: 150,
          ownerId: 150,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Ingredient",
          description: "It works.",
          image: "nobsc-ingredient-default"
        },
        validIngredientEntity
      );
    });

    it('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: 5432,
        ingredientTypeId: 2,
        authorId: 150,
        ownerId: 150,
        brand: "Some Brand",
        variety: "Some Variety",
        name: "My Ingredient",
        description: "It works.",
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
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Ingredient deleted.'})};

    it('uses deleteByIngredientId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteByIngredientId).toHaveBeenCalledWith(5432);
    });

    it('uses deleteByOwnerId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteByOwnerId).toHaveBeenCalledWith(5432, 150);
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