import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { StaffAuthController } from '../../../../src/controllers/staff';
import {
  validLoginRequest,
  validRegisterRequest,
  validStaffCreation,
  //validStaffUpdate
} from '../../../../src/lib/validations/staff';

const pool: Partial<Pool> = {};
const controller = new StaffAuthController(<Pool>pool);

jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
mockBcrypt.hash.mockResolvedValue(
  "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql', () => ({
  Staff: jest.fn().mockImplementation(() => ({
    getByEmail: mockgetByEmail,
    getByName: mockgetByName,
    create: mockcreate,
    update: mockupdate,
    //delete: mockdelete
  }))
}));
let mockgetByEmail = jest.fn();
let mockgetByName = jest.fn();
let mockcreate = jest.fn();
let mockupdate = jest.fn();
//let mockdelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff auth controller', () => {
  describe('register method', () => {
    describe('when staffname is shorter than 6 chars', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "Password99$",
        staffname: "Name"
      };
      const message = 'Staffname must be at least 6 characters.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when staffname is longer than 20 chars', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "Password99$",
        staffname: "NameLongerThanTwentyCharacters"
      };
      const message = 'Staffname must be no more than 20 characters.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "Pa99$",
        staffname: "NameIsGood"
      };
      const message = 'Password must be at least 6 characters.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
        staffname: "NameIsGood"
      };
      const message = 'Password must be no more than 54 characters.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when staffname already taken', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "Password99$",
        staffname: "NameIsGood"
      };
      const message = 'Staffname already taken.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockgetByName = jest.fn().mockResolvedValue([{staffname: "NameIsGood"}]);
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when email already in use', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "Password99$",
        staffname: "NameIsGood"
      };
      const message = 'Email already in use.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockgetByName = jest.fn().mockResolvedValue([]);
        mockgetByEmail = jest.fn().mockResolvedValue([{staffname: "NameIsGood"}]);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when ok', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "Password99$",
        staffname: "NameIsGood"
      };
      const args = {
        email: "person@person.com",
        pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
        staffname: "NameIsGood"
      };
      const message = 'Staff account created.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockgetByName = jest.fn().mockResolvedValue([]);
        mockgetByEmail = jest.fn().mockResolvedValue([]);
      });

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validRegisterRequest);
      });

      it('uses bcrypt.hash', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(bcrypt.hash).toHaveBeenCalledWith("Password99$", 10);
      });

      it('uses assert on entity', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(args, validStaffCreation);
      });

      it('uses create', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(mockcreate).toHaveBeenCalledWith(args);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });

  describe('login method', () => {
    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const staffInfo = {email: "person@person.com", password: "Pa99$"};
      const message = 'Invalid password.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
  
      it('returns sent data', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$"
      };
      const message = 'Invalid password.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
  
      it('returns sent data', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when email does not exist', () => {
      const staffInfo = {email: "person@person.com", password: "Password99$"};
      const message = 'Incorrect email or password.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockgetByEmail = jest.fn().mockResolvedValue([]);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when password is incorrect', () => {
      const staffInfo =
        {email: "person@person.com", password: "WrongPassword99$"};
      const message = 'Incorrect email or password.';
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockgetByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
        }]);
        mockBcrypt.compare.mockResolvedValue(false);
      });

      it('returns correctly', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe ('when ok', () => {
      const staffInfo = {email: "person@person.com", password: "Password99$"};
      const data = {message: 'Signed in.', staffname: "NameIsGood"};
      const req: Partial<Request> =
        {session: {...<Express.Session>{}}, body: {staffInfo}};
      const res: Partial<Response> =
        {json: jest.fn().mockResolvedValue(data), send: jest.fn()};

      beforeAll(() => {
        mockgetByEmail = jest.fn().mockResolvedValue([{
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          staffname: "NameIsGood"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validLoginRequest);
      });

      it('attaches staffInfo object to session object', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(req.session!.staffInfo).toEqual({staffname: "NameIsGood"});
      });

      it('returns sent data', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.json).toHaveBeenCalledWith(data);
        expect(actual).toEqual(data);
      });
    });
  });

  describe('logout method', () => {
    const mockDestroy = jest.fn();
    const req: Partial<Request> = {
      session: {
        ...<Express.Session>{},
        destroy: mockDestroy,
        staffInfo: {staffname: "NameIsGood"}
      }
    };
    const res: Partial<Response> = {end: jest.fn()};
    
    it('uses destroy', async () => {
      await controller.logout(<Request>req, <Response>res);
      expect(mockDestroy).toBeCalledTimes(1);
    });

    it('uses res.end', async () => {
      await controller.logout(<Request>req, <Response>res);
      expect(res.end).toBeCalledTimes(1);
    });
  });

  // TO DO: finish
  describe('update method', () => {
    const staffInfo = {
      email: "person@person.com",
      password: "Password99$",
      staffname: "NameIsGood"
    };
    const args = {
      email: "person@person.com",
      password: "Password99$",
      staffname: "NameIsGood"
    };
    const req: Partial<Request> =
      {session: {...<Express.Session>{}}, body: {staffInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Account updated.'})};

    /*it('uses assert', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(args, validStaffUpdate);
    });*/

    it ('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockupdate).toHaveBeenCalledWith(args);
    });

    it('returns sent data', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Account updated.'});
      expect(actual).toEqual({message: 'Account updated.'});
    });
  });

  // TO DO: finish
  //describe('delete method', () => {});
});