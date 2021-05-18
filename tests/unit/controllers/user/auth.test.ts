import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import * as uuid from 'uuid';
import { v4 as uuidv4 } from 'uuid';

import { UserAuthController } from '../../../../src/controllers/user';
import {
  emailConfirmationCode
} from '../../../../src/lib/services/email-confirmation-code';
import {
  validLogin,
  validLoginRequest,
  validRegister,
  validRegisterRequest,
  validResend,
  validUserCreation,
  validUserUpdate,
  validVerify,
  validVerifyRequest,
} from '../../../../src/lib/validations/user';

const pool: Partial<Pool> = {};
const controller = new UserAuthController(<Pool>pool);

jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
mockBcrypt.hash.mockResolvedValue(
  "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
);

jest.mock('superstruct');

jest.mock('uuid');
const mockUUID = uuid as jest.Mocked<typeof uuid>;
mockUUID.v4.mockReturnValue("123XYZ");

jest.mock('../../../../src/lib/services/email-confirmation-code', () => {
  const originalModule = jest
    .requireActual('../../../../src/lib/services/email-confirmation-code');
  return {...originalModule, emailConfirmationCode: jest.fn()};
});

jest.mock('../../../../src/access/mysql', () => ({
  User: jest.fn().mockImplementation(() => ({
    getByEmail, getByName, create, verify, update, delete: mockDelete
  }))
}));
let getByEmail = jest.fn();
let getByName = jest.fn();
let create = jest.fn();
let verify = jest.fn();
let update = jest.fn();
let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user auth controller', () => {
  describe('register method', () => {
    describe('when username is shorter than 6 chars', () => {
      const userInfo =
        {email: "person@person.com", password: "Password99$", username: "Name"};
      const message = 'Username must be at least 6 characters.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when username is longer than 20 chars', () => {
      const userInfo = {
        email: "person@person.com",
        password: "Password99$",
        username: "NameLongerThanTwentyCharacters"
      };
      const message = 'Username must be no more than 20 characters.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const userInfo = {
        email: "person@person.com",
        password: "Pa99$",
        username: "NameIsGood"
      };
      const message = 'Password must be at least 6 characters.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const userInfo = {
        email: "person@person.com",
        password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
        username: "NameIsGood"
      };
      const message = 'Password must be no more than 54 characters.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when username already taken', () => {
      const userInfo = {
        email: "person@person.com",
        password: "Password99$",
        username: "NameIsGood"
      };
      const message = 'Username already taken.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message})
      };

      beforeAll(() => {
        getByName = jest.fn().mockResolvedValue([{username: "NameIsGood"}]);
      });

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when email already in use', () => {
      const userInfo = {
        email: "person@person.com",
        password: "Password99$",
        username: "NameIsGood"
      };
      const message = 'Email already in use.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message})
      };

      beforeAll(() => {
        getByName = jest.fn().mockResolvedValue([]);
        getByEmail = jest.fn().mockResolvedValue([{username: "NameIsGood"}]);
      });

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when ok', () => {
      const userInfo = {
        email: "person@person.com",
        password: "Password99$",
        username: "NameIsGood"
      };
      const args = {
        email: "person@person.com",
        pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
        username: "NameIsGood",
        confirmationCode: "123XYZ"
      };
      const message = 'User account created.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByName = jest.fn().mockResolvedValue([]);
        getByEmail = jest.fn().mockResolvedValue([]);
      });

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validRegisterRequest);
      });

      it('uses bcrypt.hash', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(bcrypt.hash).toHaveBeenCalledWith("Password99$", 10);
      });

      it('uses uuidv4', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(uuidv4).toBeCalledTimes(1);
      });

      it('uses assert on entity', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(args, validUserCreation);
      });

      it('uses create', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(create).toHaveBeenCalledWith(args);
      });

      it('uses emailConfirmationCode', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(emailConfirmationCode)
          .toHaveBeenCalledWith("person@person.com", "123XYZ");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });

  describe('verify method', () => {
    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const userInfo = {
        email: "person@person.com",
        password: "Pa99$",
        confirmationCode: "123XYZ"
      };
      const message = 'Invalid password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      it('uses assert on request', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validVerifyRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const userInfo = {
        email: "person@person.com",
        pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
        confirmationCode: "123XYZ"
      };
      const message = 'Invalid password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      it('uses assert on request', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validVerifyRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when email does not exist', () => {
      const userInfo = {
        email: "person@person.com",
        password: "Password99$",
        confirmationCode: "123XYZ"
      };
      const message =
        'An issue occurred, please double check your info and try again.'
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([]);
      });

      it('uses assert on request', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validVerifyRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is incorrect', () => {
      const userInfo = {
        email: "person@person.com",
        password: "WrongPassword99$",
        confirmationCode: "123XYZ"
      };
      const message = 'Incorrect email or password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
      });

      it('uses assert on request', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validVerifyRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when the sent confirmation code is incorrect', () => {
      const userInfo = {
        email: "person@person.com",
        password: "Password99$",
        confirmationCode: "456ABC"
      };
      const message =
        'An issue occurred, please double check your info and try again.'
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validVerifyRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when ok', () => {
      const userInfo = {
        email: "person@person.com",
        password: "Password99$",
        confirmationCode: "123XYZ"
      };
      const message = 'User account verified.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validVerifyRequest);
      });

      it ('uses verify', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(verify).toHaveBeenCalledWith("person@person.com");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });

  describe('resendConfirmationCode method', () => {
    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const userInfo = {email: "person@person.com", password: "Pa99$"};
      const message = 'Invalid password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const userInfo = {
        email: "person@person.com",
        password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$"
      };
      const message = 'Invalid password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when email does not exist', () => {
      const userInfo = {email: "person@person.com", password: "Password99$"};
      const message = 'Incorrect email or password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([]);
      });

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is incorrect', () => {
      const userInfo =
        {email: "person@person.com", password: "WrongPassword99$"};
      const message = 'Incorrect email or password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(false);
      });

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when account is already verified', () => {
      const userInfo = {email: "person@person.com", password: "Password99$"};
      const message = 'Already verified.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when ok', () => {
      const userInfo = {email: "person@person.com", password: "Password99$"};
      const message = 'Confirmation code re-sent.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });

      it('uses emailConfirmationCode', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(emailConfirmationCode)
          .toHaveBeenCalledWith("person@person.com", "123XYZ");
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });

  describe('login method', () => {
    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const userInfo = {email: "person@person.com", password: "Pa99$"};
      const message = 'Invalid password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
      
      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const userInfo = {
        email: "person@person.com",
        password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$"
      };
      const message = 'Invalid password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
      
      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when email does not exist', () => {
      const userInfo = {email: "person@person.com", password: "Password99$"};
      const message = 'Incorrect email or password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([]);
      });

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is incorrect', () => {
      const userInfo =
        {email: "person@person.com", password: "WrongPassword99$"};
      const message = 'Incorrect email or password.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(false);
      });

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when account is not yet verified', () => {
      const userInfo = {email: "person@person.com", password: "Password99$"};
      const message = 'Please check your email for your confirmation code.';
      const req: Partial<Request> = {body: {userInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      })

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe ('when ok', () => {
      const userInfo = {email: "person@person.com", password: "Password99$"};
      const req: Partial<Request> = {
        session: {...<Express.Session>{}},
        body: {userInfo}
      };
      const res: Partial<Response> = {
        json: jest.fn().mockResolvedValue({
          message: 'Signed in.',
          username: "NameIsGood"
        }),
        send: jest.fn()
      };

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          username: "NameIsGood",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(userInfo, validLoginRequest);
      });

      it('attaches userInfo object to session object', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(req.session!.userInfo).toEqual({username: "NameIsGood"});
      });

      it('returns sent data', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Signed in.',
          username: "NameIsGood"
        });
        expect(actual).toEqual({
          message: 'Signed in.',
          username: "NameIsGood"
        });
      });
    });
  });

  describe('logout method', () => {
    const mockDestroySession = jest.fn();
    const req: Partial<Request> = {
      session: {
        ...<Express.Session>{},
        destroy: mockDestroySession,
        userInfo: {username: "Name"}
      }
    };
    const res: Partial<Response> = {end: jest.fn()};
    
    it('destroys session', async () => {
      await controller.logout(<Request>req, <Response>res);
      expect(mockDestroySession).toBeCalledTimes(1);
    });

    it('uses res.end', async () => {
      await controller.logout(<Request>req, <Response>res);
      expect(res.end).toBeCalledTimes(1);
    });
  });

  describe('update method', () => {
    const userInfo = {
      email: "person@person.com",
      password: "Password99$",
      username: "Name"
    };
    //const args
    const message = 'Account updated.';
    const req: Partial<Request> = {
      session: {...<Express.Session>{}, userInfo: {name: "Name"}},
      body: {userInfo}
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(userInfo, validUserUpdate);
    });

    it ('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(update).toHaveBeenCalledWith(userInfo);
    });

    it('returns sent data', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('delete method', () => {
    const message = 'Account deleted.';
    const req: Partial<Request> =
      {session: {...<Express.Session>{}, userInfo: {name: "Name"}}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses delete', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDelete).toHaveBeenCalledWith("Name");
    });

    it('returns sent data', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });
});