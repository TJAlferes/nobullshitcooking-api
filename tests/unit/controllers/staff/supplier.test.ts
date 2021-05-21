import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { StaffSupplierController } from '../../../../src/controllers/staff';
import { validSupplier } from '../../../../src/lib/validations/entities';

const pool: Partial<Pool> = {};
const controller = new StaffSupplierController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql', () => ({
  Supplier: jest.fn().mockImplementation(() => ({
    create: mockcreate, update: mockupdate, delete: mockdelete
  }))
}));
let mockcreate = jest.fn();
let mockupdate = jest.fn();
let mockdelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff supplier controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: "1"}};

  describe ('create method', () => {
    const message = 'Supplier created.';
    const req: Partial<Request> = {session, body: {name: "Name"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith({name: "Name"}, validSupplier);
    });

    it('uses create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockcreate).toHaveBeenCalledWith("Name");
    });

    it('returns sent data', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe ('update method', () => {
    const message = 'Supplier updated.';
    const req: Partial<Request> = {session, body: {id: "1", name: "Name"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith({name: "Name"}, validSupplier);
    });

    it('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockupdate).toHaveBeenCalledWith("Name");
    });

    it('returns sent data', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe ('delete method', () => {
    const message = 'Supplier deleted.';
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses delete', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockdelete).toHaveBeenCalledWith(1);
    });
    
    it('returns sent data', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });
});