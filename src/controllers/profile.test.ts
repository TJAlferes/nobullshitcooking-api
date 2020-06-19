//const httpMocks = require('node-mocks-http');
//const request = require('supertest');
import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { FavoriteRecipe } from '../mysql-access/FavoriteRecipe';
import { Recipe } from '../mysql-access/Recipe';
import { User } from '../mysql-access/User';
import { profileController } from './profile';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/FavoriteRecipe', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {viewMyFavoriteRecipes: jest.fn().mockResolvedValue([rows])};
  })
}));

jest.mock('../mysql-access/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {viewRecipes: jest.fn().mockResolvedValue([rows])};
  })
}));

jest.mock('../mysql-access/User', () => ({
  User: jest.fn().mockImplementation(() => {
    const rows: any = [{user_id: 1, avatar: "Name23"}];
    return {viewUserByName: jest.fn().mockResolvedValue([rows])};
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('profile controller', () => {
  describe('viewProfile method', () => {
    const req: Partial<Request> = {params: {username: "Name"}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({
        message: 'Success.',
        avatar: "Name23",
        publicRecipes: [rows],
        favoriteRecipes: [rows]
      })
    };

    it('uses validation', async () => {
      await profileController.viewProfile(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses User mysql access', async () => {
      await profileController.viewProfile(<Request>req, <Response>res);
      const MockedUser = mocked(User, true);
      expect(MockedUser).toHaveBeenCalledTimes(1);
    });

    it('uses Recipe mysql access', async () => {
      await profileController.viewProfile(<Request>req, <Response>res);
      const MockedRecipe = mocked(Recipe, true);
      expect(MockedRecipe).toHaveBeenCalledTimes(1);
    });

    it('uses FavoriteRecipe mysql access', async () => {
      await profileController.viewProfile(<Request>req, <Response>res);
      const MockedFavoriteRecipe = mocked(FavoriteRecipe, true);
      expect(MockedFavoriteRecipe).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      const avatar = "Name23";
      await profileController.viewProfile(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({
        message: 'Success.',
        avatar,
        publicRecipes: [rows],
        favoriteRecipes: [rows]
      });
    });

    it('returns correctly', async () => {
      const actual = await profileController
      .viewProfile(<Request>req, <Response>res);
      expect(actual).toEqual({
        message: 'Success.',
        avatar: "Name23",
        publicRecipes: [rows],
        favoriteRecipes: [rows]
      });
    });
  });
});