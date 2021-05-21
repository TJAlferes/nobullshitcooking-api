import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { UserPlanController } from '../../../../src/controllers/user';
import { validPlan } from '../../../../src/lib/validations/entities';

const pool: Partial<Pool> = {};
const controller = new UserPlanController(<Pool>pool);

jest.mock('superstruct');

const row = {id: 1, name: "Name"};
const rows = [{id: 1, name: "Name"}, {id: 2, name: "Name"}];
jest.mock('../../../../src/access/mysql', () => ({
  Plan: jest.fn().mockImplementation(() => ({
    view: mockview,
    viewById: mockviewById,
    create: mockcreate,
    update: mockupdate,
    deleteById: mockdeleteById
  }))
}));
let mockview = jest.fn().mockResolvedValue(rows);
let mockviewById = jest.fn().mockResolvedValue([row]);
let mockcreate = jest.fn();
let mockupdate = jest.fn();
let mockdeleteById = jest.fn();

describe('user plan controller', () => {
  const planInfo = {name: "Name", data: "{some: data}"};
  const args = {authorId: 88, ownerId: 88, ...planInfo};
  const session = {...<Express.Session>{}, userInfo: {id: 88}};

  describe('view method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses view correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockview).toHaveBeenCalledWith("Name");
    });

    it('returns sent data', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });

  describe('viewById method', () => {
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(row)};

    it('uses viewById correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockviewById).toHaveBeenCalledWith(1, 88);
    });

    it('returns sent data', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });

  describe('create method', () => {
    const message = 'Plan created.';
    const req: Partial<Request> = {session, body: {planInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};
    
    it('uses assert', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validPlan);
    });

    it('uses create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockcreate).toHaveBeenCalledWith(args);
    });

    it('returns sent data', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('update method', () => {
    const message = 'Plan updated.';
    const req: Partial<Request> =
      {session, body: {planInfo: {id: 1, ...planInfo}}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validPlan);
    });

    it('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockupdate).toHaveBeenCalledWith({id: 1, ...args});
    });

    it('returns sent data', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('deleteById method', () => {
    const message = 'Plan deleted.';
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Plan deleted.'})};

    it('uses deleteById', async () => {
      await controller.deleteById(<Request>req, <Response>res);
      expect(mockdeleteById).toHaveBeenCalledWith(1, 88);
    });

    it('returns sent data', async () => {
      const actual = await controller.deleteById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });
});