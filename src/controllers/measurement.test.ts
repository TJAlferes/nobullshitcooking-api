import { Request, Response } from 'express';

import { measurementController } from './measurement';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('../mysql-access/Measurement', () => ({
  Measurement: jest.fn().mockImplementation(() => ({
    viewMeasurements: mockViewMeasurements,
    viewMeasurementById: mockViewMeasurementById
  }))
}));
let mockViewMeasurements = jest.fn().mockResolvedValue([rows]);
let mockViewMeasurementById = jest.fn().mockResolvedValue([rows]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('measurement controller', () => {
  describe('viewMeasurements method', () => {
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewMeasurements correctly', async () => {
      await measurementController.viewMeasurements(<Request>{}, <Response>res);
      expect(mockViewMeasurements).toHaveBeenCalledTimes(1);
    });

    it('sends data correctly', async () => {
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

    it('uses viewMeasurementById correctly', async () => {
      await measurementController
      .viewMeasurementById(<Request>req, <Response>res);
      expect(mockViewMeasurementById).toHaveBeenCalledWith(1);
    });

    it('sends data correctly', async () => {
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