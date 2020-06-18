import { Request, Response } from 'express';
//import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Content } from '../mysql-access/Content';
import { contentController } from './content';

const rows: any = [{id: 1, name: "Name"}];

//jest.mock('superstruct');

jest.mock('../mysql-access/Content', () => ({
  Content: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      getContentLinksByTypeName: jest.fn().mockResolvedValue([rows]),
      viewContentById: jest.fn().mockResolvedValue([rows]),
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('content controller', () => {
  describe('getContentLinksByTypeName method', () => {
    const req: Partial<Request> = {params: {contentTypeName: "Name"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses Content mysql access', async () => {
      await contentController
      .getContentLinksByTypeName(<Request>req, <Response>res);
      const MockedContent = mocked(Content, true);
      expect(MockedContent).toHaveBeenCalledTimes(1);
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

    /*it('uses validation', async () => {
      await contentController.viewContentById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });*/

    it('uses Content mysql access', async () => {
      await contentController.viewContentById(<Request>req, <Response>res);
      const MockedContent = mocked(Content, true);
      expect(MockedContent).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
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