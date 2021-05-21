import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { ProfileController } from '../../../src/controllers';

const pool: Partial<Pool> = {};
const controller = new ProfileController(<Pool>pool);

const row = {id: 1, name: "Name"};
const rows = [{id: 1, name: "Name"}, {id: 2, name: "Name"}];
jest.mock('../../../src/access/mysql', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => ({
    viewByUserId: mockviewByUserId
  })),
  Recipe: jest.fn().mockImplementation(() => ({view: mockview})),
  User: jest.fn().mockImplementation(() => ({viewByName: mockviewByName}))
}));
let mockviewByUserId = jest.fn().mockResolvedValue(rows);
let mockview = jest.fn().mockResolvedValue(rows);
let mockviewByName = jest.fn().mockResolvedValue(row);

jest.mock('superstruct');

afterEach(() => {
  jest.clearAllMocks();
});

describe('profile controller', () => {
  describe('view method', () => {
    const data =
      {message: 'Success.', publicRecipes: rows, favoriteRecipes: rows};
    const req: Partial<Request> = {params: {username: "Name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(data)};

    it('uses User.viewByName', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockviewByName).toHaveBeenCalledWith("Name");
    });

    it('uses Recipe.view', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockview).toHaveBeenCalledWith(1);
    });

    it('uses FavoriteRecipe.viewByUserId', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockviewByUserId).toHaveBeenCalledWith(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(data);
      expect(actual).toEqual(data);
    });
  });
});