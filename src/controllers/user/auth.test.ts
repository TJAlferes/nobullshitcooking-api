//const httpMocks = require('node-mocks-http');
//const request = require('supertest');
import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import {
  emailConfirmationCode
} from '../../lib/services/email-confirmation-code';
import { Content } from '../../mysql-access/Content';
import { Equipment } from '../../mysql-access/Equipment';
import { Ingredient } from '../../mysql-access/Ingredient';
import { FavoriteRecipe } from '../../mysql-access/FavoriteRecipe';
import { Friendship } from '../../mysql-access/Friendship';
//import { Notification } from '../../mysql-access/Notification';
import { Plan } from '../../mysql-access/Plan';
import { Recipe } from '../../mysql-access/Recipe';
import { SavedRecipe } from '../../mysql-access/SavedRecipe';
import { User } from '../../mysql-access/User';
import { userAuthController } from './auth';

jest.mock('superstruct');
jest.mock('../../lib/services/email-confirmation-code', () => {
  const originalModule = jest
  .requireActual('../../lib/services/email-confirmation-code');
  return {...originalModule, emailConfirmationCode: jest.fn()};
});
jest.mock('../../mysql-access/User', () => {
  const originalModule = jest.requireActual('../../mysql-access/User');
  return {
    ...originalModule,
    User: jest.fn().mockImplementation(() => ({
      getUserByEmail: mockGetUserByEmail,
      getUserByName: mockGetUserByName,
      createUser: mockCreateUser,
      verifyUser: mockVerifyUser,
      updateUser: mockUpdateUser,
      deleteUser: mockDeleteUser
    }))
  };
});
let mockGetUserByEmail = jest.fn();
let mockGetUserByName = jest.fn();
let mockCreateUser = jest.fn();
let mockVerifyUser = jest.fn();
let mockUpdateUser = jest.fn();
let mockDeleteUser = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user auth controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 1}};

  describe('register method', () => {

    describe('when username is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "Name"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Username must be at least 6 characters.'
        })
      };

      it('sends data', async () => {
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Username must be at least 6 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Username must be at least 6 characters.'
        });
      });
    });

    describe('when username is longer than 20 chars', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "NameLongerThanTwentyCharacters"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Username must be no more than 20 characters.'
        })
      };

      it('sends data', async () => {
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Username must be no more than 20 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Username must be no more than 20 characters.'
        });
      });
    });

    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Pa99$",
            username: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Password must be at least 6 characters.'
        })
      };

      it('sends data', async () => {
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Password must be at least 6 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Password must be at least 6 characters.'
        });
      });
    });

    describe('when password is longer than 54 chars', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            username: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Password must be no more than 54 characters.'
        })
      };

      it('sends data', async () => {
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Password must be no more than 54 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Password must be no more than 54 characters.'
        });
      });
    });

    describe('when username already taken', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Username already taken.'})
      };

      it('sends data', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 150}]]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Username already taken.'});
      });
  
      it('returns correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 150}]]);
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Username already taken.'});
      });
    });

    describe('when email already in use', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Email already in use.'})
      };

      it('sends data', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([[]]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([[{user_id: 150}]]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Email already in use.'});
      });
  
      it('returns correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([[]]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([[{user_id: 150}]]);
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Email already in use.'});
      });
    });

    describe('when ok', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User account created.'})
      };

      it('uses emailConfirmationCode', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([[]]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([[]]);
        await userAuthController.register(<Request>req, <Response>res);
        const MockedEmailConfirmationCode = mocked(emailConfirmationCode, true);
        expect(MockedEmailConfirmationCode).toHaveBeenCalledTimes(1);
      });

      it('sends data', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([[]]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([[]]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User account created.'});
      });
  
      it('returns correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([[]]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([[]]);
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User account created.'});
      });
    });

  });

  describe('verify method', () => {

    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Pa99$",
            onfirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Invalid password.'})
      };

      it('sends data', async () => {
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            onfirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Invalid password.'})
      };

      it('sends data', async () => {
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when email does not exist', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'An issue occurred, please double check your info and try again.'
        })
      };

      it('sends data', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([[]]);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([[]]);
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
    });

    describe('when password is incorrect', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "WrongPassword99$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Incorrect email or password.'
        })
      };

      it('sends data', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([[{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]]);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Incorrect email or password.'
        });
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([[{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]]);
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Incorrect email or password.'
        });
      });
    });

    describe('when the sent confirmation code is incorrect', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            confirmationCode: "456ABC"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'An issue occurred, please double check your info and try again.'
        })
      };

      it('sends data', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([[{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]]);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([[{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]]);
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
    });

    describe('when ok', () => {
      const req: Partial<Request> = {
        session,
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User account verified.'})
      };

      it('sends data', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([[{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]]);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User account verified.'});
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([[{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]]);
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User account verified.'});
      });
    });

  });

  describe('resendConfirmationCode method', () => {});

  describe('login method', () => {});

  describe('logout method', () => {});

  describe('setAvatar method', () => {});

  describe('updateUsername method', () => {});

  describe('updateEmail method', () => {});

  describe('updatePassword method', () => {});

  describe('deleteAccount method', () => {});
});