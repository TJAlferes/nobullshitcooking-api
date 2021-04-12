import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { UserPlanController } from '../../../../src/controllers/user';
import { validPlanEntity } from '../../../../src/lib/validations/plan/entity';

const pool: Partial<Pool> = {};
const controller = new UserPlanController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql', () => ({
  Plan: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewById: mockViewById,
    create: mockCreate,
    update: mockUpdate,
    deleteById: mockDeleteById
  }))
}));
let mockView =
  jest.fn().mockResolvedValue([[{id: "Name Plan 1"}, {id: "Name Plan 2"}]]);
let mockViewById = jest.fn().mockResolvedValue([[{id: "Name Plan 2"}]]);
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockDeleteById = jest.fn();

describe('user plan controller', () => {
  const session = {...<Express.Session>{}, userInfo: {username: "Name"}};

  describe('view method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{id: "Name Plan 1"}, {id: "Name Plan 2"}]]
      )
    };

    it('uses view correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith("Name");
    });

    it('sends data correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith([[{id: "Name Plan 1"}, {id: "Name Plan 2"}]]);
    });

    it('returns correctly', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: "Name Plan 1"}, {id: "Name Plan 2"}]]);
    });
  });

  describe('viewById method', () => {
    const req: Partial<Request> = {session, body: {id: "Name Plan 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: "Name Plan 2"}])};

    it('uses viewById correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith("Name Plan 2", "Name");
    });

    it('sends data correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: "Name Plan 2"}]);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: "Name Plan 2"}]);
    });
  });

  describe('create method', () => {
    const req: Partial<Request> =
      {session, body: {planInfo: {name: "Name", data: "{some: data}"}}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Plan created.'})};
    
    it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          author: "Name",
          owner: "Name",
          name: "Name",
          data: "{some: data}"
        },
        validPlanEntity
      );
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        author: "Name",
        owner: "Name",
        name: "Name",
        data: "{some: data}"
      });
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Plan created.'});
    });

    it('returns correctly', async () => {
      const actual =
        await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Plan created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {planInfo: {id: "Name Plan 2", name: "Name", data: "{some: data}"}}
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Plan updated.'})};

    it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          author: "Name",
          owner: "Name",
          name: "Name",
          data: "{some: data}"
        },
        validPlanEntity
      );
    });

    it('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: "Name Plan 2",
        author: "Name",
        owner: "Name",
        name: "Name",
        data: "{some: data}"
      });
    });

    it('sends data correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Plan updated.'});
    });

    it('returns correctly', async () => {
      const actual =
        await controller.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Plan updated.'});
    });
  });

  describe('deleteById method', () => {
    const req: Partial<Request> = {session, body: {id: "Name Plan 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Plan deleted.'})};

    it('uses deleteById correctly', async () => {
      await controller.deleteById(<Request>req, <Response>res);
      expect(mockDeleteById).toHaveBeenCalledWith("Name Plan 2", "Name");
    });

    it('sends data correctly', async () => {
      await controller.deleteById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Plan deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.deleteById(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Plan deleted.'});
    });
  });

});