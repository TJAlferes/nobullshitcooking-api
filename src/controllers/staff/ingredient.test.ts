import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validIngredientEntity
} from '../../lib/validations/ingredient/ingredientEntity';
import { staffIngredientController } from './ingredient';

jest.mock('superstruct');

jest.mock('../../elasticsearch-access/IngredientSearch', () => {
  const originalModule = jest
  .requireActual('../../elasticsearch-access/IngredientSearch');
  return {
    ...originalModule,
    IngredientSearch: jest.fn().mockImplementation(() => ({
      saveIngredient: mockSaveIngredient,
      deleteIngredient: mockESDeleteIngredient
    }))
  };
});
let mockSaveIngredient = jest.fn();
let mockESDeleteIngredient = jest.fn();

jest.mock('../../mysql-access/Ingredient', () => {
  const originalModule = jest.requireActual('../../mysql-access/Ingredient');
  return {
    ...originalModule,
    Ingredient: jest.fn().mockImplementation(() => ({
      getIngredientForElasticSearchInsert: mockGetIngredientForElasticSearchInsert,
      createIngredient: mockCreateIngredient,
      updateIngredient: mockUpdateIngredient,
      deleteIngredient: mockDeleteIngredient
    }))
  };
});
let mockGetIngredientForElasticSearchInsert = jest.fn().mockResolvedValue(
  [[{ingredient_id: 321}]]
);
let mockCreateIngredient = jest.fn().mockResolvedValue({insertId: 321});
let mockUpdateIngredient = jest.fn();
let mockDeleteIngredient = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe ('staff ingredient controller', () => {
  const session = {...<Express.Session>{}, userInfo: {staffId: 15}};

  describe('createIngredient method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          ingredientTypeId: 3,
          ingredientBrand: "Some Brand",
          ingredientVariety: "Some Variety",
          ingredientName: "My Ingredient",
          ingredientDescription: "Some description.",
          ingredientImage: "some-image"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Ingredient created.'})
    };

    it('uses assert correctly', async () => {
      await staffIngredientController
      .createIngredient(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          ingredientTypeId: 3,
          authorId: 1,
          ownerId: 1,
          ingredientBrand: "Some Brand",
          ingredientVariety: "Some Variety",
          ingredientName: "My Ingredient",
          ingredientDescription: "Some description.",
          ingredientImage: "some-image"
        },
        validIngredientEntity
      );
    });

    it('uses createIngredient correctly', async () => {
      await staffIngredientController
      .createIngredient(<Request>req, <Response>res);
      expect(mockCreateIngredient).toBeCalledWith({
        ingredientTypeId: 3,
        authorId: 1,
        ownerId: 1,
        ingredientBrand: "Some Brand",
        ingredientVariety: "Some Variety",
        ingredientName: "My Ingredient",
        ingredientDescription: "Some description.",
        ingredientImage: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffIngredientController
      .createIngredient(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Ingredient created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffIngredientController
      .createIngredient(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient created.'});
    });
  });

  describe('updateIngredient method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          ingredientId: 321,
          ingredientTypeId: 3,
          ingredientBrand: "Some Brand",
          ingredientVariety: "Some Variety",
          ingredientName: "My Ingredient",
          ingredientDescription: "Some description.",
          ingredientImage: "some-image"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Ingredient updated.'})
    };

    it('uses assert correctly', async () => {
      await staffIngredientController
      .updateIngredient(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          ingredientTypeId: 3,
          authorId: 1,
          ownerId: 1,
          ingredientBrand: "Some Brand",
          ingredientVariety: "Some Variety",
          ingredientName: "My Ingredient",
          ingredientDescription: "Some description.",
          ingredientImage: "some-image"
        },
        validIngredientEntity
      );
    });

    it('uses updateIngredient correctly', async () => {
      await staffIngredientController
      .updateIngredient(<Request>req, <Response>res);
      expect(mockUpdateIngredient).toBeCalledWith({
        ingredientId: 321,
        ingredientTypeId: 3,
        authorId: 1,
        ownerId: 1,
        ingredientBrand: "Some Brand",
        ingredientVariety: "Some Variety",
        ingredientName: "My Ingredient",
        ingredientDescription: "Some description.",
        ingredientImage: "some-image"
      });
    });

    it('sends data correctly', async () => {
      await staffIngredientController
      .updateIngredient(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Ingredient updated.'});
    });

    it('returns correctly', async () => {
      const actual = await staffIngredientController
      .updateIngredient(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient updated.'});
    });
  });

  describe('deleteIngredient method', () => {
    const req: Partial<Request> = {session, body: {ingredientId: 321}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Ingredient deleted.'})
    };

    it('uses deleteIngredient correctly', async () => {
      await staffIngredientController
      .deleteIngredient(<Request>req, <Response>res);
      expect(mockDeleteIngredient).toBeCalledWith(321);
    });

    it('uses ElasticSearch deleteIngredient correctly', async () => {
      await staffIngredientController
      .deleteIngredient(<Request>req, <Response>res);
      expect(mockESDeleteIngredient).toBeCalledWith(String(321));
    });

    it('sends data correctly', async () => {
      await staffIngredientController
      .deleteIngredient(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Ingredient deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffIngredientController
      .deleteIngredient(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient deleted.'});
    });
  });

});