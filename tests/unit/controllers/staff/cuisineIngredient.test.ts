import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import {
  StaffCuisineIngredientController
} from '../../../../src/controllers/staff/cuisineIngredient';

const pool: Partial<Pool> = {};
const controller = new StaffCuisineIngredientController(<Pool>pool);

jest.mock('../../../../src/access/mysql/CuisineIngredient', () => ({
  CuisineIngredient: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    delete: mockDelete
  }))
}));
let mockCreate = jest.fn();
let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff cuisine ingredient controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: 15}};

  describe('create method', () => {
    const req: Partial<Request> =
      {session, body: {cuisineId: 4, ingredientId: 4}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({
        message: 'Cuisine ingredient created.'
      })
    };

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith({message: 'Cuisine ingredient created.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine ingredient created.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> =
      {session, body: {cuisineId: 4, ingredientId: 4}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({
        message: 'Cuisine ingredient deleted.'
      })
    };

    it('uses delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith({message: 'Cuisine ingredient deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine ingredient deleted.'});
    });
  });

});