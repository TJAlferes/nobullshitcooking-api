//const httpMocks = require('node-mocks-http');
//const request = require('supertest');
import { Request, Response } from 'express';
import { assert } from 'superstruct';
import bcrypt from 'bcrypt';

import { validLoginRequest } from '../../lib/validations/staff/loginRequest';
import {
  validRegisterRequest
} from '../../lib/validations/staff/registerRequest';
import { validStaffEntity } from '../../lib/validations/staff/staffEntity';
import { staffAuthController } from './auth';

jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
mockBcrypt.hash.mockResolvedValue(
  "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
);

jest.mock('superstruct');

jest.mock('../../mysql-access/Staff', () => {
  const originalModule = jest.requireActual('../../mysql-access/Staff');
  return {
    ...originalModule,
    Staff: jest.fn().mockImplementation(() => {
      return {
        getStaffByEmail: mockGetStaffByEmail,
        getStaffByName: mockGetStaffByName,
        createStaff: mockCreateStaff
      };
    })
  };
});
let mockGetStaffByEmail = jest.fn();
let mockGetStaffByName = jest.fn();
let mockCreateStaff = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff auth controller', () => {
  describe('register method', () => {
    // finish
  });

  describe('login method', () => {
    // finish
  });

  describe('logout method', () => {
    const mockDestroy = jest.fn();
    const req: Partial<Request> = {
      session: {
        ...<Express.Session>{},
        destroy: mockDestroy,
        staffInfo: {staffId: 15}
      }
    };
    const res: Partial<Response> = {end: jest.fn()};
    
    it('uses destroy', async () => {
      await staffAuthController.logout(<Request>req, <Response>res);
      expect(mockDestroy).toBeCalledTimes(1);
    });

    it('uses res.end', async () => {
      await staffAuthController.logout(<Request>req, <Response>res);
      expect(res.end).toBeCalledTimes(1);
    });
  });

  describe('updateStaff method', () => {
    // finish
  });

  describe('deleteStaff method', () => {
    // finish
  });
});