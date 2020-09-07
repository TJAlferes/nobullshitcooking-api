import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { profileController } from '../../../src/controllers/profile';
import {
  validProfileRequest
} from '../../../src/lib/validations/profile/request';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../../../src/mysql-access/FavoriteRecipe', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => ({
    viewByUserId: mockViewByUserId
  }))
}));
let mockViewByUserId = jest.fn().mockResolvedValue([rows]);

jest.mock('../../../src/mysql-access/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => ({view: mockView}))
}));
let mockView = jest.fn().mockResolvedValue([rows]);

jest.mock('../../../src/mysql-access/User', () => ({
  User: jest.fn().mockImplementation(() => ({viewByName: mockViewByName}))
}));
let mockViewByName =
  jest.fn().mockResolvedValue([[{user_id: 1, avatar: "Name23"}]]);

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
      await profileController.view(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith({username: "Name"}, validProfileRequest);
    });

    it('uses user.viewByName correctly', async () => {
      await profileController.view(<Request>req, <Response>res);
      expect(mockViewByName).toHaveBeenCalledTimes(1);
    });

    it('uses recipe.view correctly', async () => {
      await profileController.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledTimes(1);
    });

    it('uses favoriteRecipe.viewByUserId correctly', async () => {
      await profileController.view(<Request>req, <Response>res);
      expect(mockViewByUserId).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await profileController.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Success.',
        avatar: "Name23",
        publicRecipes: [rows],
        favoriteRecipes: [rows]
      });
    });

    it('returns correctly', async () => {
      const actual = await profileController.view(<Request>req, <Response>res);
      expect(actual).toEqual({
        message: 'Success.',
        avatar: "Name23",
        publicRecipes: [rows],
        favoriteRecipes: [rows]
      });
    });
  });
});