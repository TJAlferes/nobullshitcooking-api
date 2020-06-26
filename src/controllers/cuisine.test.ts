import { Request, Response } from 'express';

import { cuisineController } from './cuisine';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/Cuisine', () => ({
  Cuisine: jest.fn().mockImplementation(() => ({
    viewCuisines: mockViewCuisines,
    viewCuisineById: mockViewCuisinesById,
    viewCuisineDetailById: mockViewCuisineDetailById
  }))
}));
let mockViewCuisines = jest.fn().mockResolvedValue([rows]);
let mockViewCuisinesById =jest.fn().mockResolvedValue([rows]);
let mockViewCuisineDetailById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('cuisine controller', () => {
  describe('viewCuisines method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewCuisines correctly', async () => {
      await cuisineController.viewCuisines(<Request>{}, <Response>res);
      expect(mockViewCuisines).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await cuisineController.viewCuisines(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineController
      .viewCuisines(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewCuisineById method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewCuisineById correctly', async () => {
      await cuisineController.viewCuisineById(<Request>req, <Response>res);
      expect(mockViewCuisinesById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await cuisineController.viewCuisineById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await cuisineController
      .viewCuisineById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });

  describe('viewCuisineDetailById method', () => {
    const req: Partial<Request> = {params: {cuisineId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewCuisineDetailById correctly', async () => {
      await cuisineController
      .viewCuisineDetailById(<Request>req, <Response>res);
      expect(mockViewCuisineDetailById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await cuisineController
      .viewCuisineDetailById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await cuisineController
      .viewCuisineDetailById(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});