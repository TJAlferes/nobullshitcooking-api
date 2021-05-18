import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { ProfileController } from '../../../src/controllers';

const pool: Partial<Pool> = {};
const controller = new ProfileController(<Pool>pool);

const rows = [{id: 1, name: "Name"}];
jest.mock('../../../src/access/mysql', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => ({viewByUserId})),
  Recipe: jest.fn().mockImplementation(() => ({view: view})),
  User: jest.fn().mockImplementation(() => ({viewByName: viewByName}))
}));
let viewByUserId = jest.fn().mockResolvedValue([rows]);
let view = jest.fn().mockResolvedValue([rows]);
let viewByName = jest.fn().mockResolvedValue([{id: 1}]);

jest.mock('superstruct');

afterEach(() => {
  jest.clearAllMocks();
});

describe('profile controller', () => {
  describe('view method', () => {
    const data =
      {message: 'Success.', publicRecipes: [rows], favoriteRecipes: [rows]};
    const req: Partial<Request> = {params: {username: "Name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(data)};

    it('uses user.viewByName', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(viewByName).toHaveBeenCalledTimes(1);
    });

    it('uses recipe.view', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(view).toHaveBeenCalledTimes(1);
    });

    it('uses favoriteRecipe.viewByUserId', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(viewByUserId).toHaveBeenCalledTimes(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(data);
      expect(actual).toEqual(data);
    });
  });
});