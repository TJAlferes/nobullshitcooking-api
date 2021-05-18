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
    getByEmail,
    getByName,
    create,
    update,
    //delete
  }))
}));
let getByEmail = jest.fn();
let getByName = jest.fn();
let create = jest.fn();
let update = jest.fn();
//let delete = jest.fn();

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
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Staffname must be at least 6 characters.'
        })
      };

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Staffname must be at least 6 characters.'
        });
        expect(actual)
          .toEqual({message: 'Staffname must be at least 6 characters.'});
      });
    });

    describe('when staffname is longer than 20 chars', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "Password99$",
        staffname: "NameLongerThanTwentyCharacters"
      };
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Staffname must be no more than 20 characters.'
        })
      };

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Staffname must be no more than 20 characters.'
        });
        expect(actual)
          .toEqual({message: 'Staffname must be no more than 20 characters.'});
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
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Password must be at least 6 characters.'
        })
      };

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Password must be at least 6 characters.'
        });
        expect(actual)
          .toEqual({message: 'Password must be at least 6 characters.'});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
        staffname: "NameIsGood"
      };
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Password must be no more than 54 characters.'
        })
      };

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Password must be no more than 54 characters.'
        });
        expect(actual)
          .toEqual({message: 'Password must be no more than 54 characters.'});
      });
    });

    describe('when staffname already taken', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "Password99$",
        staffname: "NameIsGood"
      };
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Staffname already taken.'})
      };

      beforeAll(() => {
        getByName = jest.fn().mockResolvedValue([{staffname: "NameIsGood"}]);
      });

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validRegisterRequest);
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Staffname already taken.'});
        expect(actual).toEqual({message: 'Staffname already taken.'});
      });
    });

    describe('when email already in use', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "Password99$",
        staffname: "NameIsGood"
      };
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Email already in use.'})
      };

      beforeAll(() => {
        getByName = jest.fn().mockResolvedValue([]);
        getByEmail = jest.fn().mockResolvedValue([{staffname: "NameIsGood"}]);
      });

      it('uses assert on request', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validRegisterRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Email already in use.'});
        expect(actual).toEqual({message: 'Email already in use.'});
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
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Staff account created.'})
      };

      beforeAll(() => {
        getByName = jest.fn().mockResolvedValue([]);
        getByEmail = jest.fn().mockResolvedValue([]);
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
        expect(create).toHaveBeenCalledWith(args);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Staff account created.'});
        expect(actual).toEqual({message: 'Staff account created.'});
      });
    });
  });

  describe('login method', () => {
    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const staffInfo = {email: "person@person.com", password: "Pa99$"};
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'Invalid password.'})};
      
      it('uses assert on request', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid password.'});
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const staffInfo = {
        email: "person@person.com",
        password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$"
      };
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Invalid password.'})
      };

      it('uses assert on request', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid password.'});
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when email does not exist', () => {
      const staffInfo = {email: "person@person.com", password: "Password99$"};
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Incorrect email or password.'
        })
      };

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([]);
      });

      it('uses assert on request', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validLoginRequest);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Incorrect email or password.'});
        expect(actual).toEqual({message: 'Incorrect email or password.'});
      });
    });

    describe('when password is incorrect', () => {
      const staffInfo =
        {email: "person@person.com", password: "WrongPassword99$"};
      const req: Partial<Request> = {body: {staffInfo}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Incorrect email or password.'
        })
      };

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
        }]);
        mockBcrypt.compare.mockResolvedValue(false);
      });

      it('uses assert on request', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(staffInfo, validLoginRequest);
      });

      it('returns correctly', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Incorrect email or password.'});
        expect(actual).toEqual({message: 'Incorrect email or password.'});
      });
    });

    describe ('when ok', () => {
      const staffInfo = {email: "person@person.com", password: "Password99$"};
      const args = {message: 'Signed in.', staffname: "NameIsGood"};
      const req: Partial<Request> =
        {session: {...<Express.Session>{}}, body: {staffInfo}};
      const res: Partial<Response> = {
        json: jest.fn().mockResolvedValue(args),
        send: jest.fn()
      };

      beforeAll(() => {
        getByEmail = jest.fn().mockResolvedValue([{
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
        expect(res.json).toHaveBeenCalledWith(args);
        expect(actual).toEqual(args);
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
      expect(update).toHaveBeenCalledWith(args);
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