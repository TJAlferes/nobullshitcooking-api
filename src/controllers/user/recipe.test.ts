import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { RecipeSearch } from '../../elasticsearch-access/RecipeSearch';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { pool } from '../../lib/connections/mysqlPoolConnection';
//
import { Recipe } from '../../mysql-access/Recipe';
import { RecipeEquipment } from '../../mysql-access/RecipeEquipment';
import { RecipeIngredient } from '../../mysql-access/RecipeIngredient';
import { RecipeMethod } from '../../mysql-access/RecipeMethod';
import { RecipeSubrecipe } from '../../mysql-access/RecipeSubrecipe';
import { userRecipeController } from './recipe';

jest.mock('superstruct');

jest.mock('../../lib/connections/elasticsearchClient');

jest.mock('../../lib/connections/mysqlPoolConnection');

jest.mock('../../elasticsearch-access/RecipeSearch', () => {
  const originalModule = jest
  .requireActual('../../elasticsearch-access/RecipeSearch');
  return {
    ...originalModule,
    RecipeSearch: jest.fn().mockImplementation(() => ({saveRecipe: jest.fn()}))
  };
});

jest.mock('../../mysql-access/Recipe', () => {
  const originalModule = jest.requireActual('../../mysql-access/Recipe');
  return {
    ...originalModule,
    Recipe: jest.fn().mockImplementation(() => ({
      viewRecipes: mockViewRecipes,
      viewRecipeById: mockViewRecipeById,
      getInfoToEditMyUserRecipe: mockGetInfoToEditMyUserRecipe,
      //
      //
      disownMyPublicUserRecipe: jest.fn(),
      deleteMyPrivateUserRecipe: jest.fn()
    }))
  };
});
let mockViewRecipes = jest.fn();
let mockViewRecipeById = jest.fn();
let mockGetInfoToEditMyUserRecipe = jest.fn();
//
//

jest.mock('../../mysql-access/RecipeEquipment', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeEquipment');
  return {
    ...originalModule,
    RecipeEquipment: jest.fn().mockImplementation(() => ({
      deleteRecipeEquipment: jest.fn()
    }))
  };
});

jest.mock('../../mysql-access/RecipeIngredient', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeIngredient');
  return {
    ...originalModule,
    RecipeIngredient: jest.fn().mockImplementation(() => ({
      deleteRecipeIngredients: jest.fn()
    }))
  };
});

jest.mock('../../mysql-access/RecipeMethod', () => {
  const originalModule = jest.requireActual('../../mysql-access/RecipeMethod');
  return {
    ...originalModule,
    RecipeMethod: jest.fn().mockImplementation(() => ({
      deleteRecipeMethods: jest.fn()
    }))
  };
});

jest.mock('../../mysql-access/RecipeSubrecipe', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeSubrecipe');
  return {
    ...originalModule,
    RecipeSubrecipe: jest.fn().mockImplementation(() => ({
      deleteRecipeSubrecipes: jest.fn(),
      deleteRecipeSubrecipesBySubrecipeId: jest.fn()
    }))
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('user recipe controller', () => {
  describe ('viewAllMyPrivateUserRecipes method', () => {

  });

  describe ('viewAllMyPublicUserRecipes method', () => {

  });

  describe ('viewMyPrivateUserRecipe method', () => {

  });

  describe ('viewMyPublicUserRecipe method', () => {

  });

  describe ('getInfoToEditMyPrivateUserRecipe method', () => {

  });

  describe ('getInfoToEditMyPublicUserRecipe method', () => {

  });

  describe ('createRecipe method', () => {

  });

  describe ('updateMyUserRecipe method', () => {

  });

  describe ('deleteMyPrivateUserRecipe method', () => {
    const req: Partial<Request> = {
      session: {...<Express.Session>{}, userInfo: {userId: 150}},
      body: {recipeId: 5432}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe deleted.'})
    };

    it('uses RecipeEquipment mysql access', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      const MockedRecipeEquipment = mocked(RecipeEquipment, true);
      expect(MockedRecipeEquipment).toHaveBeenCalledTimes(1);
    });

    it('uses RecipeIngredient mysql access', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      const MockedRecipeIngredient = mocked(RecipeIngredient, true);
      expect(MockedRecipeIngredient).toHaveBeenCalledTimes(1);
    });

    it('uses RecipeMethod mysql access', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      const MockedRecipeMethod = mocked(RecipeMethod, true);
      expect(MockedRecipeMethod).toHaveBeenCalledTimes(1);
    });

    it('uses RecipeSubrecipe mysql access', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      const MockedRecipeSubrecipe = mocked(RecipeSubrecipe, true);
      expect(MockedRecipeSubrecipe).toHaveBeenCalledTimes(1);
    });

    it('uses Recipe mysql access', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      const MockedRecipe = mocked(Recipe, true);
      expect(MockedRecipe).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Recipe deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe deleted.'});
    });
  });

  describe ('disownMyPublicUserRecipe method', () => {

  });
});