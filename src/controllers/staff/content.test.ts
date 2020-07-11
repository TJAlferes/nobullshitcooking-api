import { Request, Response } from 'express';
import { assert, coerce } from 'superstruct';

import {
  validCreatingContentEntity
} from '../../lib/validations/content/creatingContentEntity';
import {
  validEditingContentEntity
} from '../../lib/validations/content/editingContentEntity';
import { staffContentController } from './content';

jest.mock('superstruct');

jest.mock('../../mysql-access/Content', () => {
  const originalModule = jest.requireActual('../../mysql-access/Content');
  return {
    ...originalModule,
    Content: jest.fn().mockImplementation(() => ({
      createContent: mockCreateContent,
      updateContent: mockUpdateContent,
      deleteContent: mockDeleteContent
    }))
  };
});
let mockCreateContent = jest.fn();
let mockUpdateContent = jest.fn();
let mockDeleteContent = jest.fn();

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
  const session = {...<Express.Session>{}, staffInfo: {staffId: 15}};
  mockDate = new Date(1466424490000);
  spyDate = jest
  .spyOn(global, 'Date')
  .mockImplementation(() => mockDate as unknown as string);

  describe('createContent method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        contentInfo: {
          contentTypeId: 7,
          published: null,
          title: "Some Title",
          contentItems: "[]"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Content created.'})
    };

    it('uses assert correctly', async () => {
      await staffContentController.createContent(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        coerce({
          contentTypeId: 7,
          authorId: 1,
          ownerId: 1,
          created: ((mockDate).toISOString()).split("T")[0],
          published: null,
          title: "Some Title",
          contentItems: "[]"
        }, validCreatingContentEntity),
        validCreatingContentEntity
      );
    });

    it('uses createContent correctly', async () => {
      await staffContentController.createContent(<Request>req, <Response>res);
      expect(mockCreateContent).toHaveBeenCalledWith({
        contentTypeId: 7,
        authorId: 1,
        ownerId: 1,
        created: ((mockDate).toISOString()).split("T")[0],
        published: null,
        title: "Some Title",
        contentItems: "[]"
      });
    });

    it('sends data correctly', async () => {
      await staffContentController.createContent(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Content created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffContentController
      .createContent(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Content created.'});
    });
  });

  describe('updateContent method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        contentInfo: {
          contentId: 35,
          contentTypeId: 7,
          published: null,
          title: "Some Title",
          contentItems: "[]"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Content updated.'})
    };

    it('uses assert correctly', async () => {
      await staffContentController.updateContent(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        coerce({
          contentTypeId: 7,
          ownerId: 1,
          published: null,
          title: "Some Title",
          contentItems: "[]"
        }, validEditingContentEntity),
        validEditingContentEntity
      );
    });

    it('uses updateContent correctly', async () => {
      await staffContentController.updateContent(<Request>req, <Response>res);
      expect(mockUpdateContent).toHaveBeenCalledWith({
        contentId: 35,
        contentTypeId: 7,
        ownerId: 1,
        published: null,
        title: "Some Title",
        contentItems: "[]"
      });
    });

    it('sends data correctly', async () => {
      await staffContentController.updateContent(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Content updated.'});
    });

    it('returns correctly', async () => {
      const actual = await staffContentController
      .updateContent(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Content updated.'});
    });
  });

  describe('deleteContent method', () => {
    const req: Partial<Request> = {session, body: {contentId: 35}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Content deleted.'})
    };

    it('uses deleteContent correctly', async () => {
      await staffContentController.deleteContent(<Request>req, <Response>res);
      expect(mockDeleteContent).toHaveBeenCalledWith(1, 35);
    });

    it('sends data correctly', async () => {
      await staffContentController.deleteContent(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Content deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffContentController
      .deleteContent(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Content deleted.'});
    });
  });

});