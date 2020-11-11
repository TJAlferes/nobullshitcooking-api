import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
//import { assert } from 'superstruct';

import {
  StaffSupplierController
} from '../../../../src/controllers/staff/supplier';
//import { validSupplierEntity } from '../../../../src/lib/validations/supplier/entity';

const pool: Partial<Pool> = {};
const controller = new StaffSupplierController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewByName: mockViewByName,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete
  }))
}));
let mockView =
  jest.fn().mockResolvedValue([[{name: "Name 1"}, {name: "Name 2"}]]);
let mockViewByName = jest.fn().mockResolvedValue([[{name: "Name 1"}]]);
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff supplier controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {staffname: "Name"}};

  //

  describe ('create method', () => {
    const req: Partial<Request> = {session, body: {name: "Name"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Supplier created.'})};

    /*it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith();
    });*/

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith("Name");
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Supplier created.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Supplier created.'});
    });
  });

  describe ('update method', () => {
    const req: Partial<Request> = {session, body: {name: "Name"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Supplier updated.'})};

    /*it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith();
    });*/

    it ('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith("Name");
    });

    it('sends data correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Supplier updated.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Supplier updated.'});
    });
  });

  describe ('delete method', () => {
    const req: Partial<Request> = {session, body: {name: "Name"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Supplier deleted.'})};

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Supplier deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Supplier deleted.'});
    });
  });
});