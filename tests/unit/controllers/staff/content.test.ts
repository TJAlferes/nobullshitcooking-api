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

jest.mock('../../../../src/access/mysql/Content', () => ({
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
  const session = {...<Express.Session>{}, staffInfo: {staffname: "Name"}};

  mockDate = new Date(1466424490000);
  spyDate = jest
    .spyOn(global, 'Date')
    .mockImplementation(() => mockDate as unknown as string);

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        contentInfo: {
          type: "Type",
          published: null,
          title: "Title",
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
          type: "Type",
          author: "NOBSC",
          owner: "NOBSC",
          created: ((mockDate).toISOString()).split("T")[0],
          published: null,
          title: "Title",
          items: "[]"
        }, validContentCreation),
        validContentCreation
      );
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        type: "Type",
        author: "NOBSC",
        owner: "NOBSC",
        created: ((mockDate).toISOString()).split("T")[0],
        published: null,
        title: "Title",
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
          id: "NOBSC Title",
          type: "Type",
          published: null,
          title: "Title",
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
          type: "Type",
          owner: "NOBSC",
          published: null,
          title: "Title",
          items: "[]"
        }, validContentUpdate),
        validContentUpdate
      );
    });

    it('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: "NOBSC Title",
        type: "Type",
        owner: "NOBSC",
        published: null,
        title: "Title",
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
    const req: Partial<Request> = {session, body: {id: "NOBSC Title"}};
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