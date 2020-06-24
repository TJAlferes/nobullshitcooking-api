import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validIngredientEntity
} from '../../lib/validations/ingredient/ingredientEntity';
import { userIngredientController } from './ingredient';

jest.mock('superstruct');

jest.mock('../../mysql-access/Ingredient', () => {
  const originalModule = jest.requireActual('../../mysql-access/Ingredient');
  return {
    ...originalModule,
    Ingredient: jest.fn().mockImplementation(() => ({
      viewIngredients: mockViewIngredients,
      viewIngredientById: mockViewIngredientById,
      createMyPrivateUserIngredient: mockCreateMyPrivateUserIngredient,
      updateMyPrivateUserIngredient: mockUpdateMyPrivateUserIngredient,
      deleteMyPrivateUserIngredient: mockDeleteMyPrivateUserIngredient
    }))
  };
});
let mockViewIngredients = jest.fn().mockResolvedValue(
  [[{ingredient_id: 383}, {ingredient_id: 5432}]]
);
let mockViewIngredientById = jest.fn().mockResolvedValue(
  [[{ingredient_id: 5432}]]
);
let mockCreateMyPrivateUserIngredient = jest.fn();
let mockUpdateMyPrivateUserIngredient = jest.fn();
let mockDeleteMyPrivateUserIngredient = jest.fn();

jest.mock('../../mysql-access/RecipeIngredient', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeIngredient');
  return {
    ...originalModule,
    RecipeIngredient: jest.fn().mockImplementation(() => ({
      deleteRecipeIngredientsByIngredientId: mockDeleteRecipeIngredientsByIngredientId
    }))
  };
});
let mockDeleteRecipeIngredientsByIngredientId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user ingredient controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 150}};

  describe('viewAllMyPrivateUserIngredients method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{ingredient_id: 383}, {ingredient_id: 5432}]]
      )
    };

    it('uses viewIngredients correctly', async () => {
      await userIngredientController
      .viewAllMyPrivateUserIngredients(<Request>req, <Response>res);
      expect(mockViewIngredients).toHaveBeenCalledWith(150, 150);
    });

    it('sends data correctly', async () => {
      await userIngredientController
      .viewAllMyPrivateUserIngredients(<Request>req, <Response>res);
      expect(res.send)
      .toBeCalledWith([[{ingredient_id: 383}, {ingredient_id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await userIngredientController
      .viewAllMyPrivateUserIngredients(<Request>req, <Response>res);
      expect(actual).toEqual([[{ingredient_id: 383}, {ingredient_id: 5432}]]);
    });
  });

  describe('viewMyPrivateUserIngredient method', () => {
    const req: Partial<Request> = {session, body: {ingredientId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([{ingredient_id: 5432}])
    };

    it('uses viewIngredientById correctly', async () => {
      await userIngredientController
      .viewMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(mockViewIngredientById).toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data correctly', async () => {
      await userIngredientController
      .viewMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([{ingredient_id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userIngredientController
      .viewMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(actual).toEqual([{ingredient_id: 5432}]);
    });
  });

  describe('createMyPrivateUserIngredient method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          ingredientTypeId: 2,
          ingredientBrand: "Some Brand",
          ingredientVariety: "Some Variety",
          ingredientName: "My Ingredient",
          ingredientDescription: "It works.",
          ingredientImage: "nobsc-ingredient-default"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Ingredient created.'})
    };

    it('uses assert correctly', async () => {
      await userIngredientController
      .createMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          ingredientTypeId: 2,
          authorId: 150,
          ownerId: 150,
          ingredientBrand: "Some Brand",
          ingredientVariety: "Some Variety",
          ingredientName: "My Ingredient",
          ingredientDescription: "It works.",
          ingredientImage: "nobsc-ingredient-default"
        },
        validIngredientEntity
      );
    });

    it('uses createMyPrivateUserIngredient correctly', async () => {
      await userIngredientController
      .createMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(mockCreateMyPrivateUserIngredient)
      .toHaveBeenCalledWith({
        ingredientTypeId: 2,
        authorId: 150,
        ownerId: 150,
        ingredientBrand: "Some Brand",
        ingredientVariety: "Some Variety",
        ingredientName: "My Ingredient",
        ingredientDescription: "It works.",
        ingredientImage: "nobsc-ingredient-default"
      });
    });

    it('sends data correctly', async () => {
      await userIngredientController
      .createMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Ingredient created.'});
    });

    it('returns correctly', async () => {
      const actual = await userIngredientController
      .createMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient created.'});
    });
  });

  describe('updateMyPrivateUserIngredient method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        ingredientInfo: {
          ingredientId: 5432,
          ingredientTypeId: 2,
          ingredientBrand: "Some Brand",
          ingredientVariety: "Some Variety",
          ingredientName: "My Ingredient",
          ingredientDescription: "It works.",
          ingredientImage: "nobsc-ingredient-default"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Ingredient updated.'})
    };

    it('uses assert correctly', async () => {
      await userIngredientController
      .updateMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          ingredientTypeId: 2,
          authorId: 150,
          ownerId: 150,
          ingredientBrand: "Some Brand",
          ingredientVariety: "Some Variety",
          ingredientName: "My Ingredient",
          ingredientDescription: "It works.",
          ingredientImage: "nobsc-ingredient-default"
        },
        validIngredientEntity
      );
    });

    it('uses updateMyPrivateUserIngredient correctly', async () => {
      await userIngredientController
      .updateMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(mockUpdateMyPrivateUserIngredient)
      .toHaveBeenCalledWith({
        ingredientId: 5432,
        ingredientTypeId: 2,
        authorId: 150,
        ownerId: 150,
        ingredientBrand: "Some Brand",
        ingredientVariety: "Some Variety",
        ingredientName: "My Ingredient",
        ingredientDescription: "It works.",
        ingredientImage: "nobsc-ingredient-default"
      });
    });

    it('sends data correctly', async () => {
      await userIngredientController
      .updateMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Ingredient updated.'});
    });

    it('returns correctly', async () => {
      const actual = await userIngredientController
      .updateMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient updated.'});
    });
  });

  describe('deleteMyPrivateUserIngredient method', () => {
    const req: Partial<Request> = {session, body: {ingredientId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Ingredient deleted.'})
    };

    it('uses deleteRecipeIngredientByIngredientId correctly', async () => {
      await userIngredientController
      .deleteMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(mockDeleteRecipeIngredientsByIngredientId)
      .toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeIngredient correctly', async () => {
      await userIngredientController
      .deleteMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(mockDeleteMyPrivateUserIngredient)
      .toHaveBeenCalledWith(5432, 150);
    });

    it('sends data correctly', async () => {
      await userIngredientController
      .deleteMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Ingredient deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await userIngredientController
      .deleteMyPrivateUserIngredient(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Ingredient deleted.'});
    });
  });

});