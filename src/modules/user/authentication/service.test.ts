import { UserAuthenticationService } from "./service";

describe('confirm method', () => {
  // TO DO: unit test email regex
  //describe('when email', () => {});

  describe('when password is shorter than 6 chars', () => {
    const userInfo =
      {email: "person@person.com", pass: "Pa99$", confirmationCode: "123XYZ"};
    const message = 'Invalid password.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

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

    it('returns sent data', async () => {
      const actual = await controller.verify(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('when email does not exist', () => {
    const userInfo = {
      email: "person@person.com",
      pass: "Password99$",
      confirmationCode: "123XYZ"
    };
    const message =
      'An issue occurred, please double check your info and try again.'
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    beforeAll(() => {
      mockgetByEmail = jest.fn().mockResolvedValue([]);
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
      pass: "WrongPassword99$",
      confirmationCode: "123XYZ"
    };
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
      pass: "Password99$",
      confirmationCode: "456ABC"
    };
    const message =
      'An issue occurred, please double check your info and try again.'
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
      const actual = await controller.verify(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('when ok', () => {
    const userInfo = {
      email: "person@person.com",
      pass: "Password99$",
      confirmationCode: "123XYZ"
    };
    const message = 'User account verified.';
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

    it ('uses verify', async () => {
      await controller.verify(<Request>req, <Response>res);
      expect(mockverify).toHaveBeenCalledWith("person@person.com");
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
      mockgetByEmail = jest.fn().mockResolvedValue([]);
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

  describe('when account is already verified', () => {
    const userInfo = {email: "person@person.com", pass: "Password99$"};
    const message = 'Already verified.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    beforeAll(() => {
      mockgetByEmail = jest.fn().mockResolvedValue([{
        email: "person@person.com",
        pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
        confirmation_code: null
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

  describe('when ok', () => {
    const userInfo = {email: "person@person.com", pass: "Password99$"};
    const message = 'Confirmation code re-sent.';
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