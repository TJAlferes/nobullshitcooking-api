import { Request, Response } from 'express';

import { staffCuisineIngredientController } from './cuisineIngredient';

jest.mock('../../mysql-access/CuisineIngredient', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/CuisineIngredient');
  return {
    ...originalModule,
    CuisineIngredient: jest.fn().mockImplementation(() => ({
      createCuisineIngredient: mockCreateCuisineIngredient,
      deleteCuisineIngredient: mockDeleteCuisineIngredient
    }))
  };
});
let mockCreateCuisineIngredient = jest.fn();
let mockDeleteCuisineIngredient = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff cuisine ingredient controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {staffId: 15}};

  describe('createCuisineIngredient method', () => {
    const req: Partial<Request> = {
      session,
      body: {cuisineId: 4, ingredientId: 4}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({
        message: 'Cuisine ingredient created.'
      })
    };

    it('uses createCuisineIngredient correctly', async () => {
      await staffCuisineIngredientController
      .createCuisineIngredient(<Request>req, <Response>res);
      expect(mockCreateCuisineIngredient).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineIngredientController
      .createCuisineIngredient(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Cuisine ingredient created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineIngredientController
      .createCuisineIngredient(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine ingredient created.'});
    });
  });

  describe('deleteCuisineIngredient method', () => {
    const req: Partial<Request> = {
      session,
      body: {cuisineId: 4, ingredientId: 4}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({
        message: 'Cuisine ingredient deleted.'
      })
    };

    it('uses deleteCuisineIngredient correctly', async () => {
      await staffCuisineIngredientController
      .deleteCuisineIngredient(<Request>req, <Response>res);
      expect(mockDeleteCuisineIngredient).toHaveBeenCalledWith(4, 4);
    });

    it('sends data correctly', async () => {
      await staffCuisineIngredientController
      .deleteCuisineIngredient(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Cuisine ingredient deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffCuisineIngredientController
      .deleteCuisineIngredient(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Cuisine ingredient deleted.'});
    });
  });

});