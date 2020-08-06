import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { validPlanEntity } from '../../lib/validations/plan/planEntity';
import { userPlanController } from './plan';

jest.mock('superstruct');

jest.mock('../../mysql-access/Plan', () => {
  const originalModule = jest.requireActual('../../mysql-access/Plan');
  return {
    ...originalModule,
    Plan: jest.fn().mockImplementation(() => ({
      view: mockView,
      viewById: mockView,
      create: mockCreate,
      update: mockUpdate,
      deleteById: mockDeleteById
    }))
  };
});
let mockView = jest.fn().mockResolvedValue(
  [[{id: 383}, {id: 5432}]]
);
let mockViewById = jest.fn().mockResolvedValue([[{id: 5432}]]);
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockDeleteById = jest.fn();

describe('user plan controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 150}};

  describe('view method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]])
    };

    it('uses view correctly', async () => {
      await userPlanController.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith(150);
    });

    it('sends data correctly', async () => {
      await userPlanController.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([[{id: 383}, {id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await userPlanController.view(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: 383}, {id: 5432}]]);
    });
  });

  describe('viewById method', () => {
    const req: Partial<Request> = {session, body: {planId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([{id: 5432}])
    };

    it('uses viewById correctly', async () => {
      await userPlanController.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(5432, 150);
    });

    it('sends data correctly', async () => {
      await userPlanController.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userPlanController
      .viewById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: 5432}]);
    });
  });

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {planInfo: {name: "Name", data: "{some: data}"}}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Plan created.'})
    };

    it('uses assert correctly', async () => {
      await userPlanController.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          authorId: 150,
          ownerId: 150,
          name: "Name",
          data: "{some: data}"
        },
        validPlanEntity
      );
    });

    it('uses create correctly', async () => {
      await userPlanController.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        authorId: 150,
        ownerId: 150,
        name: "Name",
        data: "{some: data}"
      });
    });

    it('sends data correctly', async () => {
      await userPlanController.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Plan created.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userPlanController.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Plan created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {planInfo: {id: 5432, name: "Name", data: "{some: data}"}}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Plan updated.'})
    };

    it('uses assert correctly', async () => {
      await userPlanController.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          authorId: 150,
          ownerId: 150,
          name: "Name",
          data: "{some: data}"
        },
        validPlanEntity
      );
    });

    it('uses update correctly', async () => {
      await userPlanController.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: 5432,
        authorId: 150,
        ownerId: 150,
        name: "Name",
        data: "{some: data}"
      });
    });

    it('sends data correctly', async () => {
      await userPlanController.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Plan updated.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userPlanController.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Plan updated.'});
    });
  });

  describe('deleteById method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Plan deleted.'})
    };

    it('uses deleteById correctly', async () => {
      await userPlanController.deleteById(<Request>req, <Response>res);
      expect(mockDeleteById).toHaveBeenCalledWith(5432, 150);
    });

    it('sends data correctly', async () => {
      await userPlanController.deleteById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Plan deleted.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userPlanController.deleteById(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Plan deleted.'});
    });
  });

});