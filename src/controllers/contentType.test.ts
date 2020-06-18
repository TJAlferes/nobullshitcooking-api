import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { ContentType } from '../mysql-access/ContentType';
import { contentTypeController } from './contentType';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/ContentType', () => ({
  ContentType: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewContentTypes: jest.fn().mockResolvedValue([rows]),
      viewContentTypeById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('contentType controller', () => {
  describe('viewContentTypes method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses ContentType mysql access', async () => {
      await contentTypeController.viewContentTypes(<Request>{}, <Response>res);
      const MockedContentType = mocked(ContentType, true);
      expect(MockedContentType).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
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

    it('uses validation', async () => {
      await contentTypeController
      .viewContentTypeById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses ContentType mysql access', async () => {
      await contentTypeController
      .viewContentTypeById(<Request>req, <Response>res);
      const MockedContentType = mocked(ContentType, true);
      expect(MockedContentType).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
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