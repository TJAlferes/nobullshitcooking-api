import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { ProfileController } from '../../../src/controllers/profile';
import {
  validProfileRequest
} from '../../../src/lib/validations/profile/request';

const pool: Partial<Pool> = {};
const controller = new ProfileController(<Pool>pool);

const rows = [{id: "Name23 Title"}];

jest.mock('../../../src/access/mysql/FavoriteRecipe', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => ({
    viewByUserId: mockViewByUserId
  }))
}));
let mockViewByUserId = jest.fn().mockResolvedValue([rows]);

jest.mock('../../../src/access/mysql/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => ({view: mockView}))
}));
let mockView = jest.fn().mockResolvedValue([rows]);

jest.mock('../../../src/access/mysql/User', () => ({
  User: jest.fn().mockImplementation(() => ({viewByName: mockViewByName}))
}));
let mockViewByName =
  jest.fn().mockResolvedValue([{username: "Name23", avatar: "Name23"}]);

jest.mock('superstruct');

afterEach(() => {
  jest.clearAllMocks();
});

describe('profile controller', () => {
  describe('view method', () => {
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
      await controller.view(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith({username: "Name"}, validProfileRequest);
    });

    it('uses user.viewByName correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockViewByName).toHaveBeenCalledTimes(1);
    });

    it('uses recipe.view correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledTimes(1);
    });

    it('uses favoriteRecipe.viewByUserId correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockViewByUserId).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Success.',
        avatar: "Name23",
        publicRecipes: [rows],
        favoriteRecipes: [rows]
      });
    });

    it('returns correctly', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(actual).toEqual({
        message: 'Success.',
        avatar: "Name23",
        publicRecipes: [rows],
        favoriteRecipes: [rows]
      });
    });
  });
});