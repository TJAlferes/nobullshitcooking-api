import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { StaffAuthController } from '../../../../src/controllers/staff/auth';
import {
  validLoginRequest,
  validRegisterRequest,
  validStaffCreation
} from '../../../../src/lib/validations/staff/index';

const pool: Partial<Pool> = {};
const controller = new StaffAuthController(<Pool>pool);

jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
mockBcrypt.hash.mockResolvedValue(
  "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql/Staff', () => ({
  Staff: jest.fn().mockImplementation(() => ({
    getByEmail: mockGetByEmail,
    getByName: mockGetByName,
    create: mockCreate,
    update: mockUpdate,
    //delete: mockDelete
  }))
}));
let mockGetByEmail = jest.fn();
let mockGetByName = jest.fn();
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
//let mockDelete = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff auth controller', () => {

  describe('register method', () => {
    
    describe('when staffname is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {
            email: "person@person.com",
            password: "Password99$",
            staffname: "Name"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Staffname must be at least 6 characters.'
        })
      };

      it('uses assert on request correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            staffname: "Name"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Staffname must be at least 6 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual)
          .toEqual({message: 'Staffname must be at least 6 characters.'});
      });
    });

    describe('when staffname is longer than 20 chars', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {
            email: "person@person.com",
            password: "Password99$",
            staffname: "NameLongerThanTwentyCharacters"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Staffname must be no more than 20 characters.'
        })
      };

      it('uses assert on request correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            staffname: "NameLongerThanTwentyCharacters"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Staffname must be no more than 20 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual)
          .toEqual({message: 'Staffname must be no more than 20 characters.'});
      });
    });

    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {
            email: "person@person.com",
            password: "Pa99$",
            staffname: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Password must be at least 6 characters.'
        })
      };

      it('uses assert on request correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Pa99$",
            staffname: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Password must be at least 6 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual)
          .toEqual({message: 'Password must be at least 6 characters.'});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {
            email: "person@person.com",
            password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            staffname: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Password must be no more than 54 characters.'
        })
      };

      it('uses assert on request correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            staffname: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Password must be no more than 54 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual)
          .toEqual({message: 'Password must be no more than 54 characters.'});
      });
    });

    describe('when staffname already taken', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {
            email: "person@person.com",
            password: "Password99$",
            staffname: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Staffname already taken.'})
      };

      beforeAll(() => {
        mockGetByName = jest.fn().mockResolvedValue([{id: 150}]);
      });

      it('uses assert on request correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            staffname: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Staffname already taken.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Staffname already taken.'});
      });
    });

    describe('when email already in use', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {
            email: "person@person.com",
            password: "Password99$",
            staffname: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Email already in use.'})
      };

      beforeAll(() => {
        mockGetByName = jest.fn().mockResolvedValue([]);
        mockGetByEmail = jest.fn().mockResolvedValue([{id: 150}]);
      });

      it('uses assert on request correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            staffname: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Email already in use.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Email already in use.'});
      });
    });

    describe('when ok', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {
            email: "person@person.com",
            password: "Password99$",
            staffname: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Staff account created.'})
      };

      beforeAll(() => {
        mockGetByName = jest.fn().mockResolvedValue([]);
        mockGetByEmail = jest.fn().mockResolvedValue([]);
      });

      it('uses assert on request correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            staffname: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('uses bcrypt.hash correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(bcrypt.hash).toHaveBeenCalledWith("Password99$", 10);
      });

      it('uses assert on entity correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
            staffname: "NameIsGood"
          },
          validStaffCreation
        );
      });

      it('uses create correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(mockCreate).toHaveBeenCalledWith({
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          staffname: "NameIsGood"
        });
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Staff account created.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Staff account created.'});
      });
    });

  });

  describe('login method', () => {
    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const req: Partial<Request> =
        {body: {staffInfo: {email: "person@person.com", password: "Pa99$"}}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'Invalid password.'})};
      
      it('uses assert on request correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Pa99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {
            email: "person@person.com",
            password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Invalid password.'})
      };

      it('uses assert on request correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
          },
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when email does not exist', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {email: "person@person.com", password: "Password99$"}
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Incorrect email or password.'
        })
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([]);
      });

      it('uses assert on request correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Incorrect email or password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Incorrect email or password.'});
      });
    });

    describe('when password is incorrect', () => {
      const req: Partial<Request> = {
        body: {
          staffInfo: {email: "person@person.com", password: "WrongPassword99$"}
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Incorrect email or password.'
        })
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([{
          id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
        }]);
        mockBcrypt.compare.mockResolvedValue(false);
      });

      it('uses assert on request correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "WrongPassword99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Incorrect email or password.'});
      });

      it('returns correctly', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Incorrect email or password.'});
      });
    });

    describe ('when ok', () => {
      const req: Partial<Request> = {
        session: {...<Express.Session>{}},
        body: {
          staffInfo: {email: "person@person.com", password: "Password99$"}
        }
      };
      const res: Partial<Response> = {
        json: jest.fn().mockResolvedValue({
          message: 'Signed in.',
          staffname: "NameIsGood",
          avatar: "NameIsGood"
        }),
        send: jest.fn()
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([{
          id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          staffname: "NameIsGood",
          avatar: "NameIsGood"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('attaches staffInfo object to session object', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(req.session!.staffInfo)
          .toEqual({id: 150, staffname: "NameIsGood", avatar: "NameIsGood"});
      });

      it('sends data correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Signed in.',
          staffname: "NameIsGood",
          avatar: "NameIsGood"
        });
      });

      it('returns correctly', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Signed in.',
          staffname: "NameIsGood",
          avatar: "NameIsGood"
        });
      });
    });

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
      await controller.logout(<Request>req, <Response>res);
      expect(mockDestroy).toBeCalledTimes(1);
    });

    it('uses res.end', async () => {
      await controller.logout(<Request>req, <Response>res);
      expect(res.end).toBeCalledTimes(1);
    });
  });

  describe('update method', () => {
    // finish
    const req: Partial<Request> = {
      session: {...<Express.Session>{}, staffInfo: {id: 150}},
      body: {
        staffInfo: {
          email: "person@person.com",
          password: "Password99$",
          staffname: "NameIsGood",
          avatar: "NameIsGood"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Account updated.'})};

    /*it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          email: "person@person.com",
          pass: "Password99$",
          staffname: "NameIsGood",
          avatar: "NameIsGood"
        },
        validStaffUpdate
      );
    });*/

    it ('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: 150,
        email: "person@person.com",
        pass: "Password99$",
        staffname: "NameIsGood",
        avatar: "NameIsGood"
      });
    });

    it('sends data correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Account updated.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Account updated.'});
    });
  });

  /*describe('delete method', () => {
    // finish
  });*/

});