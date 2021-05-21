import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { UserSavedRecipeController } from '../../../../src/controllers/user';
import { validSavedRecipe } from '../../../../src/lib/validations/entities';

const pool: Partial<Pool> = {};
const controller = new UserSavedRecipeController(<Pool>pool);

jest.mock('superstruct');

const rows = [{id: 1, name: "Name"}, {id: 2, name: "Name"}];
jest.mock('../../../../src/access/mysql', () => ({
  SavedRecipe: jest.fn().mockImplementation(() => ({
    viewByUserId: mockviewByUserId, create: mockcreate, delete: mockdelete
  }))
}));
let mockviewByUserId = jest.fn().mockResolvedValue(rows);
let mockcreate = jest.fn();
let mockdelete = jest.fn();

describe('user saved recipes controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 1}};

  describe('viewByUserId method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewByUserId', async () => {
      await controller.viewByUserId(<Request>req, <Response>res);
      expect(mockviewByUserId).toHaveBeenCalledWith("Name");
    });

    it('returns sent data', async () => {
      const actual = await controller.viewByUserId(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });

  describe ('create method', () => {
    const message = 'Saved.';
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith({userId: 1, recipeId: 1}, validSavedRecipe);
    });

    it('uses create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockcreate).toHaveBeenCalledWith(1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe ('delete method', () => {
    const message = 'Unsaved.';
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith({userId: 1, recipeId: 1}, validSavedRecipe);
    });

    it('uses delete', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockdelete).toHaveBeenCalledWith(1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });
});