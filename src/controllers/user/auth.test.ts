//const httpMocks = require('node-mocks-http');
//const request = require('supertest');
import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { User } from '../../mysql-access/User';
import { userAuthController } from './auth';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../../mysql-access/User', () => ({
  User: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      getUserByEmail: jest.fn().mockResolvedValue([rows]),
      getUserByName: jest.fn().mockResolvedValue([rows]),
      getUserIdByName: jest.fn().mockResolvedValue([rows]),
      viewUserById: jest.fn().mockResolvedValue([rows]),
      createUser: jest.fn().mockResolvedValue([rows]),
      updateUser: jest.fn().mockResolvedValue([rows]),
      deleteUser: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('user auth controller', () => {
  describe('register method', () => {});

  describe('verify method', () => {});

  describe('resendConfirmationCode method', () => {});

  describe('login method', () => {});

  describe('logout method', () => {});

  describe('setAvatar method', () => {});

  describe('updateUsername method', () => {});

  describe('updateEmail method', () => {});

  describe('updatePassword method', () => {});

  describe('deleteAccount method', () => {});
});