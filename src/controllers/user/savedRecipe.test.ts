import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validSavedRecipeEntity
} from '../../lib/validations/savedRecipe/savedRecipeEntity';
import { userSavedRecipeController } from './savedRecipe';

jest.mock('superstruct');

jest.mock('../../mysql-access/SavedRecipe', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/SavedRecipe');
  return {
    ...originalModule,
    SavedRecipe: jest.fn().mockImplementation(() => ({
      viewMySavedRecipes: mockViewMySavedRecipes,
      createMySavedRecipe: mockCreateMySavedRecipe,
      deleteMySavedRecipe: mockDeleteMySavedRecipe
    }))
  };
});
let mockViewMySavedRecipes = jest.fn().mockResolvedValue(
  [[{recipe_id: 383}, {recipe_id: 5432}]]
);
let mockCreateMySavedRecipe = jest.fn();
let mockDeleteMySavedRecipe = jest.fn();

describe('user saved recipes controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 150}};

  describe('viewMySavedRecipes method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{recipe_id: 383}, {recipe_id: 5432}]]
      )
    };

    it('uses viewMySavedRecipes correctly', async () => {
      await userSavedRecipeController
      .viewMySavedRecipes(<Request>req, <Response>res);
      expect(mockViewMySavedRecipes).toHaveBeenCalledWith(150);
    });

    it('sends data correctly', async () => {
      await userSavedRecipeController
      .viewMySavedRecipes(<Request>req, <Response>res);
      expect(res.send)
      .toBeCalledWith([[{recipe_id: 383}, {recipe_id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await userSavedRecipeController
      .viewMySavedRecipes(<Request>req, <Response>res);
      expect(actual).toEqual([[{recipe_id: 383}, {recipe_id: 5432}]]);
    });
  });

  describe ('createMySavedRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Saved.'})
    };

    it('uses assert correctly', async () => {
      await userSavedRecipeController
      .createMySavedRecipe(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {userId: 150, recipeId: 5432},
        validSavedRecipeEntity
      );
    });

    it('uses createMySavedRecipe correctly', async () => {
      await userSavedRecipeController
      .createMySavedRecipe(<Request>req, <Response>res);
      expect(mockCreateMySavedRecipe).toHaveBeenCalledWith(150, 5432);
    });

    it('sends data correctly', async () => {
      await userSavedRecipeController
      .createMySavedRecipe(<Request>req, <Response>res);
      expect(res.send)
      .toBeCalledWith({message: 'Saved.'});
    });

    it('returns correctly', async () => {
      const actual = await userSavedRecipeController
      .createMySavedRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Saved.'});
    });
  });

  describe ('deleteMySavedRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Unsaved.'})
    };

    it('uses assert correctly', async () => {
      await userSavedRecipeController
      .deleteMySavedRecipe(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {userId: 150, recipeId: 5432},
        validSavedRecipeEntity
      );
    });

    it('uses deleteMySavedRecipe correctly', async () => {
      await userSavedRecipeController
      .deleteMySavedRecipe(<Request>req, <Response>res);
      expect(mockDeleteMySavedRecipe).toHaveBeenCalledWith(150, 5432);
    });

    it('sends data correctly', async () => {
      await userSavedRecipeController
      .deleteMySavedRecipe(<Request>req, <Response>res);
      expect(res.send)
      .toBeCalledWith({message: 'Unsaved.'});
    });

    it('returns correctly', async () => {
      const actual = await userSavedRecipeController
      .deleteMySavedRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Unsaved.'});
    });
  });

});