import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import {
  UserSavedRecipeController
} from '../../../../src/controllers/user/savedRecipe';
import {
  validSavedRecipeEntity
} from '../../../../src/lib/validations/savedRecipe/entity';

const pool: Partial<Pool> = {};
const controller = new UserSavedRecipeController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql/SavedRecipe', () => ({
  SavedRecipe: jest.fn().mockImplementation(() => ({
    viewByUserId: mockViewByUserId,
    create: mockCreate,
    delete: mockDelete
  }))
}));
let mockViewByUserId = jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]]);
let mockCreate = jest.fn();
let mockDelete = jest.fn();

describe('user saved recipes controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 150}};

  describe('viewByUserId method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]])};

    it('uses viewByUserId correctly', async () => {
      await controller.viewByUserId(<Request>req, <Response>res);
      expect(mockViewByUserId).toHaveBeenCalledWith(150);
    });

    it('sends data correctly', async () => {
      await controller.viewByUserId(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([[{id: 383}, {id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewByUserId(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: 383}, {id: 5432}]]);
    });
  });

  describe ('create method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Saved.'})};

    it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {userId: 150, recipeId: 5432},
        validSavedRecipeEntity
      );
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith(150, 5432);
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Saved.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Saved.'});
    });
  });

  describe ('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Unsaved.'})};

    it('uses assert correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {userId: 150, recipeId: 5432},
        validSavedRecipeEntity
      );
    });

    it('uses delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(150, 5432);
    });

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Unsaved.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Unsaved.'});
    });
  });

});