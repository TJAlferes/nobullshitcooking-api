import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validFavoriteRecipeEntity
} from '../../lib/validations/favoriteRecipe/favoriteRecipeEntity';
import { userFavoriteRecipeController } from './favoriteRecipe';

jest.mock('superstruct');

jest.mock('../../mysql-access/FavoriteRecipe', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/FavoriteRecipe');
  return {
    ...originalModule,
    FavoriteRecipe: jest.fn().mockImplementation(() => ({
      viewMyFavoriteRecipes: mockViewMyFavoriteRecipes,
      createMyFavoriteRecipe: mockCreateMyFavoriteRecipe,
      deleteMyFavoriteRecipe: mockDeleteMyFavoriteRecipe
    }))
  };
});
let mockViewMyFavoriteRecipes = jest.fn().mockResolvedValue(
  [[{recipe_id: 383}, {recipe_id: 5432}]]
);
let mockCreateMyFavoriteRecipe = jest.fn();
let mockDeleteMyFavoriteRecipe = jest.fn();

describe('user favorite recipes controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 150}};

  describe('viewMyFavoriteRecipes method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{recipe_id: 383}, {recipe_id: 5432}]]
      )
    };

    it('uses viewMyFavoriteRecipes correctly', async () => {
      await userFavoriteRecipeController
      .viewMyFavoriteRecipes(<Request>req, <Response>res);
      expect(mockViewMyFavoriteRecipes).toHaveBeenCalledWith(150);
    });

    it('sends data correctly', async () => {
      await userFavoriteRecipeController
      .viewMyFavoriteRecipes(<Request>req, <Response>res);
      expect(res.send)
      .toBeCalledWith([[{recipe_id: 383}, {recipe_id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await userFavoriteRecipeController
      .viewMyFavoriteRecipes(<Request>req, <Response>res);
      expect(actual).toEqual([[{recipe_id: 383}, {recipe_id: 5432}]]);
    });
  });

  describe ('createMyFavoriteRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Favorited.'})
    };

    it('uses assert correctly', async () => {
      await userFavoriteRecipeController
      .createMyFavoriteRecipe(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {userId: 150, recipeId: 5432},
        validFavoriteRecipeEntity
      );
    });

    it('uses createMyFavoriteRecipe correctly', async () => {
      await userFavoriteRecipeController
      .createMyFavoriteRecipe(<Request>req, <Response>res);
      expect(mockCreateMyFavoriteRecipe).toHaveBeenCalledWith(150, 5432);
    });

    it('sends data correctly', async () => {
      await userFavoriteRecipeController
      .createMyFavoriteRecipe(<Request>req, <Response>res);
      expect(res.send)
      .toBeCalledWith({message: 'Favorited.'});
    });

    it('returns correctly', async () => {
      const actual = await userFavoriteRecipeController
      .createMyFavoriteRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Favorited.'});
    });
  });

  describe ('deleteMyFavoriteRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Unfavorited.'})
    };

    it('uses assert correctly', async () => {
      await userFavoriteRecipeController
      .deleteMyFavoriteRecipe(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {userId: 150, recipeId: 5432},
        validFavoriteRecipeEntity
      );
    });

    it('uses deleteMyFavoriteRecipe correctly', async () => {
      await userFavoriteRecipeController
      .deleteMyFavoriteRecipe(<Request>req, <Response>res);
      expect(mockDeleteMyFavoriteRecipe).toHaveBeenCalledWith(150, 5432);
    });

    it('sends data correctly', async () => {
      await userFavoriteRecipeController
      .deleteMyFavoriteRecipe(<Request>req, <Response>res);
      expect(res.send)
      .toBeCalledWith({message: 'Unfavorited.'});
    });

    it('returns correctly', async () => {
      const actual = await userFavoriteRecipeController
      .deleteMyFavoriteRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Unfavorited.'});
    });
  });

});