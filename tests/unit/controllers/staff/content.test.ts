import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert, coerce } from 'superstruct';

import {
  StaffContentController
} from '../../../../src/controllers/staff/content';
import {
  validContentCreation
} from '../../../../src/lib/validations/content/create';
import {
  validContentUpdate
} from '../../../../src/lib/validations/content/update';

const pool: Partial<Pool> = {};
const controller = new StaffContentController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/mysql-access/Content', () => ({
  Content: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete
  }))
}));
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockDelete = jest.fn();

afterAll(() => {
  mockDate = null;
  spyDate.mockRestore();
  spyDate = null;
});
let mockDate: any;
let spyDate: any;

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff content controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: 15}};

  mockDate = new Date(1466424490000);
  spyDate = jest
    .spyOn(global, 'Date')
    .mockImplementation(() => mockDate as unknown as string);

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        contentInfo: {
          contentTypeId: 7,
          published: null,
          title: "Some Title",
          items: "[]"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Content created.'})};

    it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        coerce({
          contentTypeId: 7,
          authorId: 1,
          ownerId: 1,
          created: ((mockDate).toISOString()).split("T")[0],
          published: null,
          title: "Some Title",
          items: "[]"
        }, validContentCreation),
        validContentCreation
      );
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        contentTypeId: 7,
        authorId: 1,
        ownerId: 1,
        created: ((mockDate).toISOString()).split("T")[0],
        published: null,
        title: "Some Title",
        items: "[]"
      });
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Content created.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Content created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        contentInfo: {
          id: 35,
          contentTypeId: 7,
          published: null,
          title: "Some Title",
          items: "[]"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Content updated.'})};

    it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        coerce({
          contentTypeId: 7,
          ownerId: 1,
          published: null,
          title: "Some Title",
          items: "[]"
        }, validContentUpdate),
        validContentUpdate
      );
    });

    it('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: 35,
        contentTypeId: 7,
        ownerId: 1,
        published: null,
        title: "Some Title",
        items: "[]"
      });
    });

    it('sends data correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Content updated.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Content updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 35}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Content deleted.'})};

    it('uses delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(1, 35);
    });

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Content deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Content deleted.'});
    });
  });

});