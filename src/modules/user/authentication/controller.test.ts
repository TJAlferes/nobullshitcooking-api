import { Request, Response } from 'express';

import { userAuthenticationController } from './controller';
import { UserRepo } from '../repo';
import type { ModifiedSession } from '../../../app';

const userRepoMock = UserRepo as unknown as jest.Mocked<UserRepo>;

interface MockRequest extends Request {
  session: ModifiedSession;
}

describe('user authentication controller', () => {
  const userData = {
    user_id: '1',
    email: 'user1@nobsc.com',
    username: "user1",
    confirmation_code: "1"
  };
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        friendname: 'user2'
      },
      session: {
        user_id: '1'
      }
    } as MockRequest;
    res = {
      status: jest.fn(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('login method', () => {
  // TO DO: unit test email regex
  //describe('when email', () => {});

  describe('when password is shorter than 6 chars', () => {
    const userInfo = {email: "person@person.com", pass: "Pa99$"};
    const message = 'Invalid password.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

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
      pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$"
    };
    const message = 'Invalid password.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('returns sent data', async () => {
      const actual =
        await controller.resendConfirmationCode(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('when email does not exist', () => {
    const userInfo = {email: "person@person.com", pass: "Password99$"};
    const message = 'Incorrect email or password.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    beforeAll(() => {
      getByEmail = jest.fn().mockResolvedValue([]);
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
      {email: "person@person.com", pass: "WrongPassword99$"};
    const message = 'Incorrect email or password.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    beforeAll(() => {
      mockgetByEmail = jest.fn().mockResolvedValue([{
        email: "person@person.com",
        pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
        confirmation_code: "123XYZ"
      }]);
      mockBcrypt.compare.mockResolvedValue(false);
    });

    it('returns sent data', async () => {
      const actual =
        await controller.resendConfirmationCode(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('when account is not yet verified', () => {
    const userInfo = {email: "person@person.com", pass: "Password99$"};
    const message = 'Please check your email for your confirmation code.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    beforeAll(() => {
      mockgetByEmail = jest.fn().mockResolvedValue([{
        email: "person@person.com",
        pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
        confirmation_code: "123XYZ"
      }]);
      mockBcrypt.compare.mockResolvedValue(true);
    });

    it('returns sent data', async () => {
      const actual =
        await controller.resendConfirmationCode(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe ('when ok', () => {
    const userInfo = {email: "person@person.com", pass: "Password99$"};
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
      mockgetByEmail = jest.fn().mockResolvedValue([{
        email: "person@person.com",
        pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
        username: "NameIsGood",
        confirmation_code: null
      }]);
      mockBcrypt.compare.mockResolvedValue(true);
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
      expect(actual).toEqual({message: 'Signed in.', username: "NameIsGood"});
    });
  });
});