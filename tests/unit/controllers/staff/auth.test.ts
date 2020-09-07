import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { staffAuthController } from '../../../../src/controllers/staff/auth';
import {
  validLoginRequest,
  validRegisterRequest,
  validStaffCreation
} from '../../../../src/lib/validations/staff/index';

jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
mockBcrypt.hash.mockResolvedValue(
  "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
);

jest.mock('superstruct');

jest.mock('../../../../src/mysql-access/Staff', () => ({
  Staff: jest.fn().mockImplementation(() => ({
    getByEmail: mockGetByEmail,
    getByName: mockGetByName,
    create: mockCreate
  }))
}));
let mockGetByEmail = jest.fn();
let mockGetByName = jest.fn();
let mockCreate = jest.fn();

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
        staffInfo: {id: 15}
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