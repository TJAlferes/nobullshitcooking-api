import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Staff } from '../../mysql-access/Staff';
import { staffAuthController } from './auth';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../../mysql-access/Staff', () => ({
  Staff: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      viewRecipeTypes: jest.fn().mockResolvedValue([rows]),
      viewRecipeTypeById: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('user auth controller', () => {
  describe('register method', () => {});

  describe('login method', () => {});

  describe('logout method', () => {});

  /*describe('setAvatar method', () => {});

  describe('updateUsername method', () => {});

  describe('updateEmail method', () => {});

  describe('updatePassword method', () => {});

  describe('deleteAccount method', () => {});*/
});