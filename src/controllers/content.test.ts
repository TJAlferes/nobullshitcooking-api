import { Request, Response } from 'express';

import { contentController } from './content';

const rows: any = [{id: 1, name: "Name"}];  // TO DO: use realistic data

jest.mock('../mysql-access/Content', () => ({
  Content: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewById: mockViewById,
    getLinksByContentTypeName: mockGetLinksByContentTypeName
  }))
}));
let mockView = jest.fn().mockResolvedValue([rows]);
let mockViewById = jest.fn().mockResolvedValue([rows]);
let mockGetLinksByContentTypeName = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

// fix

describe('content controller', () => {
  describe('view method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view correctly', async () => {
      await contentController.view(<Request>{}, <Response>res);
      expect(mockView).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await contentController.view(<Request>{}, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await contentController.view(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewById method', () => {
    const req: Partial<Request> = {params: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewById correctly', async () => {
      await contentController.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(1, 1);
    });

    it('sends data correctly', async () => {
      await contentController.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual =
        await contentController.viewById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });

  describe('getLinksByContentTypeName method', () => {
    const req: Partial<Request> = {params: {name: "name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses getLinksByContentTypeName correctly', async () => {
      await contentController
        .getLinksByContentTypeName(<Request>req, <Response>res);
      expect(mockGetLinksByContentTypeName).toHaveBeenCalledWith("Name");
    });

    it('sends data', async () => {
      await contentController
        .getLinksByContentTypeName(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await contentController
        .getLinksByContentTypeName(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
});