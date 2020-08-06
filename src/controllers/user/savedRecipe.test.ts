import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validSavedRecipeEntity
} from '../../lib/validations/savedRecipe/savedRecipeEntity';
import { userSavedRecipeController } from './savedRecipe';

jest.mock('superstruct');

jest.mock('../../mysql-access/SavedRecipe', () => {
  const originalModule = jest.requireActual('../../mysql-access/SavedRecipe');
  return {
    ...originalModule,
    SavedRecipe: jest.fn().mockImplementation(() => ({
      viewByUserId: mockViewByUserId,
      create: mockCreate,
      delete: mockDelete
    }))
  };
});
let mockViewByUserId = jest.fn().mockResolvedValue(
  [[{id: 383}, {id: 5432}]]
);
let mockCreate = jest.fn();
let mockDelete = jest.fn();

describe('user saved recipes controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 150}};

  describe('viewByUserId method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{id: 383}, {id: 5432}]]
      )
    };

    it('uses viewByUserId correctly', async () => {
      await userSavedRecipeController.viewByUserId(<Request>req, <Response>res);
      expect(mockViewByUserId).toHaveBeenCalledWith(150);
    });

    it('sends data correctly', async () => {
      await userSavedRecipeController.viewByUserId(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([[{id: 383}, {id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await userSavedRecipeController
        .viewByUserId(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: 383}, {id: 5432}]]);
    });
  });

  describe ('create method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Saved.'})
    };

    it('uses assert correctly', async () => {
      await userSavedRecipeController.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {userId: 150, recipeId: 5432},
        validSavedRecipeEntity
      );
    });

    it('uses create correctly', async () => {
      await userSavedRecipeController.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith(150, 5432);
    });

    it('sends data correctly', async () => {
      await userSavedRecipeController.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Saved.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userSavedRecipeController.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Saved.'});
    });
  });

  describe ('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Unsaved.'})
    };

    it('uses assert correctly', async () => {
      await userSavedRecipeController.delete(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {userId: 150, recipeId: 5432},
        validSavedRecipeEntity
      );
    });

    it('uses delete correctly', async () => {
      await userSavedRecipeController.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(150, 5432);
    });

    it('sends data correctly', async () => {
      await userSavedRecipeController.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Unsaved.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userSavedRecipeController.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Unsaved.'});
    });
  });

});