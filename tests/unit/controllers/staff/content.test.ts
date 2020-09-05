import { Request, Response } from 'express';
import { assert, coerce } from 'superstruct';

import {
  validCreatingContentEntity
} from '../../../../src/lib/validations/content/creatingContentEntity';
import {
  validEditingContentEntity
} from '../../../../src/lib/validations/content/editingContentEntity';
import { staffContentController } from '../../../../src/controllers/staff/content';

jest.mock('superstruct');

jest.mock('../../../../src/mysql-access/Content', () => {
  const originalModule = jest.requireActual('../../../../src/mysql-access/Content');
  return {
    ...originalModule,
    Content: jest.fn().mockImplementation(() => ({
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete
    }))
  };
});
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
      await staffContentController.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        coerce({
          contentTypeId: 7,
          authorId: 1,
          ownerId: 1,
          created: ((mockDate).toISOString()).split("T")[0],
          published: null,
          title: "Some Title",
          items: "[]"
        }, validCreatingContentEntity),
        validCreatingContentEntity
      );
    });

    it('uses create correctly', async () => {
      await staffContentController.create(<Request>req, <Response>res);
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
      await staffContentController.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Content created.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffContentController.create(<Request>req, <Response>res);
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
      await staffContentController.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        coerce({
          contentTypeId: 7,
          ownerId: 1,
          published: null,
          title: "Some Title",
          items: "[]"
        }, validEditingContentEntity),
        validEditingContentEntity
      );
    });

    it('uses update correctly', async () => {
      await staffContentController.update(<Request>req, <Response>res);
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
      await staffContentController.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Content updated.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffContentController.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Content updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 35}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Content deleted.'})};

    it('uses delete correctly', async () => {
      await staffContentController.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith(1, 35);
    });

    it('sends data correctly', async () => {
      await staffContentController.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Content deleted.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffContentController.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Content deleted.'});
    });
  });

});