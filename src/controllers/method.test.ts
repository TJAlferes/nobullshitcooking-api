import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Method } from '../mysql-access/Method';
import { methodController } from './method';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/Method', () => ({
  Method: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewMethods: jest.fn().mockResolvedValue([rows]),
      viewMethodById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('method controller', () => {
  describe('viewMethods method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses Method mysql access', async () => {
      await methodController.viewMethods(<Request>{}, <Response>res);
      const MockedMethod = mocked(Method, true);
      expect(MockedMethod).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await methodController.viewMethods(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await methodController
      .viewMethods(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewMethodById method', () => {
    const req: Partial<Request> = {params: {methodId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses validation', async () => {
      await methodController
      .viewMethodById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses Method mysql access', async () => {
      await methodController
      .viewMethodById(<Request>req, <Response>res);
      const MockedMethod = mocked(Method, true);
      expect(MockedMethod).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await methodController
      .viewMethodById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await methodController
      .viewMethodById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});