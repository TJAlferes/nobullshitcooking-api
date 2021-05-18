import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { StaffContentController } from '../../../../src/controllers/staff';
import {
  validCreatingContent,
  validUpdatingContent
} from '../../../../src/lib/validations/entities';

const pool: Partial<Pool> = {};
const controller = new StaffContentController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql', () => ({
  Content: jest.fn().mockImplementation(() => ({
    create, update, delete: mockDelete
  }))
}));
let create = jest.fn();
let update = jest.fn();
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
  const session = {...<Express.Session>{}, staffInfo: {staffname: "Name"}};

  mockDate = new Date(1466424490000);
  spyDate = jest
    .spyOn(global, 'Date')
    .mockImplementation(() => mockDate as unknown as string);

  describe('create method', () => {
    const args = {
      contentTypeId: 1,
      authorId: 1,
      ownerId: 1,
      created: ((mockDate).toISOString()).split("T")[0],
      published: null,
      title: "Title",
      items: "[]"
    };
    const message = 'Content created.';
    const req: Partial<Request> = {
      session,
      body: {
        contentInfo: {
          contentTypeId: 1, published: null, title: "Title", items: "[]"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validCreatingContent);
    });

    it('uses create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(create).toHaveBeenCalledWith(args);
    });

    it('returns sent data', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('update method', () => {
    const args = {
      contentTypeId: 1,
      ownerId: 1,
      published: null,
      title: "Title",
      items: "[]"
    };
    const message = 'Content updated.';
    const req: Partial<Request> = {
      session,
      body: {
        contentInfo: {
          id: 1, contentTypeId: 1, published: null, title: "Title", items: "[]"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validUpdatingContent);
    });

    it('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(update).toHaveBeenCalledWith(args);
    });

    it('returns sent data', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('delete method', () => {
    const message = 'Content deleted.';
    const req: Partial<Request> = {session, body: {id: 1}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses delete', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });
});