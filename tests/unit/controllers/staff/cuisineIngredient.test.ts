import { Request, Response } from 'express';

import {
  staffCuisineIngredientController
} from '../../../../src/controllers/staff/cuisineIngredient';

jest.mock('../../../../src/mysql-access/CuisineIngredient', () => ({
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
      await staffCuisineIngredientController
        .create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineIngredientController
        .create(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith({message: 'Cuisine ingredient created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineIngredientController
        .create(<Request>req, <Response>res);
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
      await staffCuisineIngredientController
        .delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineIngredientController
        .delete(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith({message: 'Cuisine ingredient deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineIngredientController
        .delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine ingredient deleted.'});
    });
  });

});