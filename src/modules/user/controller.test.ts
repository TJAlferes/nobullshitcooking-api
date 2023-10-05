import { userController } from "./controller";

describe('register method', () => {
  describe('when username is shorter than 6 chars', () => {
    const userInfo =
      {email: "person@person.com", pass: "Password99$", username: "Name"};
    const message = 'Username must be at least 6 characters.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('returns sent data', async () => {
      const actual = await controller.register(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('when username is longer than 20 chars', () => {
    const userInfo = {
      email: "person@person.com",
      pass: "Password99$",
      username: "NameLongerThanTwentyCharacters"
    };
    const message = 'Username must be no more than 20 characters.';
    const req: Partial<Request> = {body: {userInfo}};
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
    const userInfo =
      {email: "person@person.com", pass: "Pa99$", username: "NameIsGood"};
    const message = 'Password must be at least 6 characters.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('returns sent data', async () => {
      const actual = await controller.register(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('when password is longer than 54 chars', () => {
    const userInfo = {
      email: "person@person.com",
      pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
      username: "NameIsGood"
    };
    const message = 'Password must be no more than 54 characters.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('returns sent data', async () => {
      const actual = await controller.register(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('when username already taken', () => {
    const userInfo = {
      email: "person@person.com",
      pass: "Password99$",
      username: "NameIsGood"
    };
    const message = 'Username already taken.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message})
    };

    beforeAll(() => {
      mockgetByName = jest.fn().mockResolvedValue([{username: "NameIsGood"}]);
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
      pass: "Password99$",
      username: "NameIsGood"
    };
    const message = 'Email already in use.';
    const req: Partial<Request> = {body: {userInfo}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message})
    };

    beforeAll(() => {
      mockgetByName = jest.fn().mockResolvedValue([]);
      mockgetByEmail =
        jest.fn().mockResolvedValue([{username: "NameIsGood"}]);
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
      pass: "Password99$",
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
      mockgetByName = jest.fn().mockResolvedValue([]);
      mockgetByEmail = jest.fn().mockResolvedValue([]);
    });

    it('uses bcrypt.hash', async () => {
      await controller.register(<Request>req, <Response>res);
      expect(bcrypt.hash).toHaveBeenCalledWith("Password99$", 10);
    });

    it('uses uuidv4', async () => {
      await controller.register(<Request>req, <Response>res);
      expect(uuidv4).toBeCalledTimes(1);
    });

    it('uses create', async () => {
      await controller.register(<Request>req, <Response>res);
      expect(mockcreate).toHaveBeenCalledWith(args);
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

describe('update method', () => {
  const userInfo = {
    email: "person@person.com",
    pass: "Password99$",
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
    expect(mockupdate).toHaveBeenCalledWith(userInfo);
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
    expect(mockdelete).toHaveBeenCalledWith("Name");
  });

  it('returns sent data', async () => {
    const actual = await controller.delete(<Request>req, <Response>res);
    expect(res.send).toHaveBeenCalledWith({message});
    expect(actual).toEqual({message});
  });
});