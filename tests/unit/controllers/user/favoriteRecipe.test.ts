import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { UserFavoriteRecipeController } from '../../../../src/controllers/user';
import {
  validFavoriteRecipeEntity
} from '../../../../src/lib/validations/favoriteRecipe/entity';

const pool: Partial<Pool> = {};
const controller = new UserFavoriteRecipeController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => ({
    viewByUser: mockViewByUser,
    create: mockCreate,
    delete: mockDelete
  }))
}));
let mockViewByUser = jest.fn().mockResolvedValue(
  [[{id: "NOBSC Title 1"}, {id: "NOBSC Title 2"}]]
);
let mockCreate = jest.fn();
let mockDelete = jest.fn();

describe('user favorite recipes controller', () => {
  const session = {...<Express.Session>{}, userInfo: {username: "Name"}};

  describe('viewByUser method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{id: "NOBSC Title 1"}, {id: "NOBSC Title 2"}]]
      )
    };

    it('uses viewByUser correctly', async () => {
      await controller.viewByUser(<Request>req, <Response>res);
      expect(mockViewByUser).toHaveBeenCalledWith("Name");
    });

    it('sends data correctly', async () => {
      await controller.viewByUser(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith([[{id: "NOBSC Title 1"}, {id: "NOBSC Title 2"}]]);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewByUser(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: "NOBSC Title 1"}, {id: "NOBSC Title 2"}]]);
    });
  });

  describe ('create method', () => {
    const req: Partial<Request> = {session, body: {id: "NOBSC Title 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Favorited.'})};

    it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {user: "Name", recipe: "NOBSC Title 2"},
        validFavoriteRecipeEntity
      );
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith("Name", "NOBSC Title 2");
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Favorited.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Favorited.'});
    });
  });

  describe ('delete method', () => {
    const req: Partial<Request> = {session, body: {id: "NOBSC Title 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Unfavorited.'})};

    it('uses assert correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {user: "Name", recipe: "NOBSC Title 2"},
        validFavoriteRecipeEntity
      );
    });

    it('uses delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith("Name", "NOBSC Title 2");
    });

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Unfavorited.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Unfavorited.'});
    });
  });

});