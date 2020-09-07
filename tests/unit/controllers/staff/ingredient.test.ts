import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  staffIngredientController
} from '../../../../src/controllers/staff/ingredient';
import {
  validIngredientEntity
} from '../../../../src/lib/validations/ingredient/entity';

jest.mock('superstruct');

jest.mock('../../../../src/elasticsearch-access/IngredientSearch', () => ({
  IngredientSearch: jest.fn().mockImplementation(() => ({
    save: mockESSave,
    delete: mockESDelete
  }))
}));
let mockESSave = jest.fn();
let mockESDelete = jest.fn();

jest.mock('../../../../src/mysql-access/Ingredient', () => ({
  Ingredient: jest.fn().mockImplementation(() => ({
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

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff ingredient controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: 15}};

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          ingredientTypeId: 3,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Ingredient",
          description: "Some description.",
          image: "some-image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Ingredient created.'})};

    it('uses assert correctly', async () => {
      await staffIngredientController.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          ingredientTypeId: 3,
          authorId: 1,
          ownerId: 1,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Ingredient",
          description: "Some description.",
          image: "some-image"
        },
        validIngredientEntity
      );
    });

    it('uses create correctly', async () => {
      await staffIngredientController.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        ingredientTypeId: 3,
        authorId: 1,
        ownerId: 1,
        brand: "Some Brand",
        variety: "Some Variety",
        name: "My Ingredient",
        description: "Some description.",
        image: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffIngredientController.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Ingredient created.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffIngredientController.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          id: 321,
          ingredientTypeId: 3,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Ingredient",
          description: "Some description.",
          image: "some-image"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Ingredient updated.'})};

    it('uses assert correctly', async () => {
      await staffIngredientController.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          ingredientTypeId: 3,
          authorId: 1,
          ownerId: 1,
          brand: "Some Brand",
          variety: "Some Variety",
          name: "My Ingredient",
          description: "Some description.",
          image: "some-image"
        },
        validIngredientEntity
      );
    });

    it('uses update correctly', async () => {
      await staffIngredientController.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: 321,
        ingredientTypeId: 3,
        authorId: 1,
        ownerId: 1,
        brand: "Some Brand",
        variety: "Some Variety",
        name: "My Ingredient",
        description: "Some description.",
        image: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffIngredientController.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Ingredient updated.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffIngredientController.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 321}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Ingredient deleted.'})};

    it('uses delete correctly', async () => {
      await staffIngredientController.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(321);
    });

    it('uses ElasticSearch delete correctly', async () => {
      await staffIngredientController.delete(<Request>req, <Response>res);
      expect(mockESDelete).toHaveBeenCalledWith(String(321));
    });

    it('sends data correctly', async () => {
      await staffIngredientController.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Ingredient deleted.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffIngredientController.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient deleted.'});
    });
  });

});