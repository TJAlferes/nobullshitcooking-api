import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Measurement } from '../mysql-access/Measurement';
import { measurementController } from './measurement';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../mysql-access/Measurement', () => ({
  Measurement: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewMeasurements: jest.fn().mockResolvedValue([rows]),
      viewMeasurementById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('measurement controller', () => {
  describe('viewMeasurements method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses Measurement mysql access', async () => {
      await measurementController.viewMeasurements(<Request>{}, <Response>res);
      const MockedMeasurement = mocked(Measurement, true);
      expect(MockedMeasurement).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await measurementController.viewMeasurements(<Request>{}, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await measurementController
      .viewMeasurements(<Request>{}, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });
  
  describe('viewMeasurementById method', () => {
    const req: Partial<Request> = {params: {measurementId: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    it('uses validation', async () => {
      await measurementController
      .viewMeasurementById(<Request>req, <Response>res);
      const MockedAssert = mocked(assert, true);
      expect(MockedAssert).toHaveBeenCalledTimes(1);
    });

    it('uses Measurement mysql access', async () => {
      await measurementController
      .viewMeasurementById(<Request>req, <Response>res);
      const MockedMeasurement = mocked(Measurement, true);
      expect(MockedMeasurement).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await measurementController
      .viewMeasurementById(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith(rows);
    });

    it('returns correctly', async () => {
      const actual = await measurementController
      .viewMeasurementById(<Request>req, <Response>res);
      expect(actual).toEqual(rows);
    });
  });
});