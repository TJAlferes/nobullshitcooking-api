//const httpMocks = require('node-mocks-http');
//const request = require('supertest');
import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { profileController } from './profile';
import { validProfileRequest } from '../lib/validations/profile/profileRequest';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/FavoriteRecipe', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => ({
    viewMyFavoriteRecipes: mockViewMyFavoriteRecipes
  }))
}));
let mockViewMyFavoriteRecipes = jest.fn().mockResolvedValue([rows]);

jest.mock('../mysql-access/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => ({viewRecipes: mockViewRecipes}))
}));
let mockViewRecipes = jest.fn().mockResolvedValue([rows]);

jest.mock('../mysql-access/User', () => ({
  User: jest.fn().mockImplementation(() => ({
    viewUserByName: mockViewUserByName
  }))
}));
let mockViewUserByName = jest.fn().mockResolvedValue(
  [[{user_id: 1, avatar: "Name23"}]]
);

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

    it('uses assert correctly', async () => {
      await profileController.viewProfile(<Request>req, <Response>res);
      expect(assert)
      .toHaveBeenCalledWith({username: "Name"}, validProfileRequest);
    });

    it('uses viewUserByName correctly', async () => {
      await profileController.viewProfile(<Request>req, <Response>res);
      expect(mockViewUserByName).toHaveBeenCalledTimes(1);
    });

    it('uses viewRecipes correctly', async () => {
      await profileController.viewProfile(<Request>req, <Response>res);
      expect(mockViewRecipes).toHaveBeenCalledTimes(1);
    });

    it('uses viewMyFavoriteRecipes correctly', async () => {
      await profileController.viewProfile(<Request>req, <Response>res);
      expect(mockViewMyFavoriteRecipes).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await profileController.viewProfile(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({
        message: 'Success.',
        avatar: "Name23",
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