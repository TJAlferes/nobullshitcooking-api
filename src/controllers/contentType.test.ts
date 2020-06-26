import { Request, Response } from 'express';

import { contentTypeController } from './contentType';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/ContentType', () => ({
  ContentType: jest.fn().mockImplementation(() => ({
    viewContentTypes: mockViewContentTypes,
    viewContentTypeById: mockViewContentTypeById
  }))
}));
let mockViewContentTypes = jest.fn().mockResolvedValue([rows]);
let mockViewContentTypeById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('contentType controller', () => {
  describe('viewContentTypes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewContentTypes correctly', async () => {
      await contentTypeController.viewContentTypes(<Request>{}, <Response>res);
      expect(mockViewContentTypes).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
      await contentTypeController.viewContentTypes(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await contentTypeController
      .viewContentTypes(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewContentTypeById method', () => {
    const req: Partial<Request> = {params: {contentTypeId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses viewContentTypeById correctly', async () => {
      await contentTypeController
      .viewContentTypeById(<Request>req, <Response>res);
      expect(mockViewContentTypeById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
      await contentTypeController
      .viewContentTypeById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await contentTypeController
      .viewContentTypeById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});