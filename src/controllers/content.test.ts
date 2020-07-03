import { Request, Response } from 'express';

import { contentController } from './content';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/Content', () => ({
  Content: jest.fn().mockImplementation(() => ({
    getContentLinksByTypeName: mockGetContentLinksByTypeName,
    viewContentById: mockViewContentById
  }))
}));
let mockGetContentLinksByTypeName = jest.fn().mockResolvedValue([rows]);
let mockViewContentById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

// fix

describe('content controller', () => {
  describe('getContentLinksByTypeName method', () => {
    const req: Partial<Request> = {params: {contentTypeName: "name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses getContentLinksByTypeName correctly', async () => {
      await contentController
      .getContentLinksByTypeName(<Request>req, <Response>res);
      expect(mockGetContentLinksByTypeName).toHaveBeenCalledWith("Name");
    });

    it('sends data', async () => {
      await contentController
      .getContentLinksByTypeName(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await contentController
      .getContentLinksByTypeName(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewContentById method', () => {
    const req: Partial<Request> = {params: {contentId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewContentById correctly', async () => {
      await contentController.viewContentById(<Request>req, <Response>res);
      expect(mockViewContentById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await contentController.viewContentById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await contentController
      .viewContentById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});