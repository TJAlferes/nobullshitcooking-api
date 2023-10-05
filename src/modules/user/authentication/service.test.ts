import { UserAuthenticationService } from "./service";
import type { UserRepoInterface, UserData } from "../repo";

jest.mock('../shared/simple-email-service');
jest.mock('./repo');

const confirmation_code = "99999999-9999-9999-9999-999999999999";
const userData = {
  user_id: "99999999-9999-9999-9999-999999999999",
  email: "username@nobsc.com",
  username: "username",
  confirmation_code: "99999999-9999-9999-9999-999999999999"
} as UserData;

describe('UserAuthenticationService', () => {
  let userRepoMock: jest.Mocked<UserRepoInterface>;
  let service: UserAuthenticationService;

  beforeEach(() => {
    userRepoMock = {
      getPassword: jest.fn(),
      getByUserId: jest.fn(),
      getByEmail: jest.fn(),
      getByUsername: jest.fn(),
      getByConfirmationCode: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepoInterface>;
    service = new UserAuthenticationService(userRepoMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isUserConfirmed method', () => {

  });

  describe('isCorrectPassword method', () => {

  });

  describe('doesUserExist method', () => {

  });

  describe('confirm method', () => {
    it('handles when user does not exist', async () => {
      userRepoMock.getByConfirmationCode.mockResolvedValue(undefined);
      try {
        await service.confirm(confirmation_code);
      } catch (err: any) {
        expect(err.message)
          .toBe('An issue occurred, please double check your info and try again.');
      }
      expect(userRepoMock.update).not.toHaveBeenCalled();
    });

    it('handles when already confirmed', async () => {
      const userData = {
        user_id: "99999999-9999-9999-9999-999999999999",
        email: "username@nobsc.com",
        username: "username",
        confirmation_code: null  // null means they're already confirmed
      } as UserData;
      userRepoMock.getByConfirmationCode.mockResolvedValue(userData);
      try {
        await service.confirm(confirmation_code);
      } catch (err: any) {
        expect(err.message).toBe("Already confirmed.");
      }
      expect(userRepoMock.update).not.toHaveBeenCalled();
    });

    it('handles when confirmation code is incorrect', async () => {
      userRepoMock.getByConfirmationCode.mockResolvedValue(userData);
      const confirmation_code = "77777777-7777-7777-7777-777777777777";
      try {
        await service.confirm(confirmation_code);
      } catch (err: any) {
        expect(err.message)
          .toBe('An issue occurred, please double check your info and try again.');
      }
      expect(userRepoMock.update).not.toHaveBeenCalled();
    });

    it('handles when password could not be found', async () => {
      userRepoMock.getByConfirmationCode.mockResolvedValue(userData);
      userRepoMock.getPassword.mockResolvedValue(undefined);
      try {
        await service.confirm(confirmation_code);
      } catch (err: any) {
        expect(err.message)
          .toBe('An issue occurred, please double check your info and try again.');
      }
      expect(userRepoMock.update).not.toHaveBeenCalled();
    });

    it('handles success', async () => {
      userRepoMock.getByConfirmationCode.mockResolvedValue(userData);
      userRepoMock.getPassword.mockResolvedValue("password");
      try {
        await service.confirm(confirmation_code);
      } catch (err: any) {
        throw err;  // fail the test
      }
      expect(userRepoMock.update).toHaveBeenCalled();
    });
  });

  describe('resendConfirmationCode method', () => {
    it('handles when email does not exist', () => {
      const userInfo = {email: "person@person.com", pass: "Password99$"};
      const message = 'Incorrect email or password.';
        mockgetByEmail = jest.fn().mockResolvedValue([]);
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
    });

    it('handles when password is incorrect', () => {
      const userInfo =
        {email: "person@person.com", pass: "WrongPassword99$"};
      const message = 'Incorrect email or password.';
        mockgetByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(false);
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
    });

    it('handles when already confirmed', () => {
      const userInfo = {email: "person@person.com", pass: "Password99$"};
      const message = 'Already verified.';
        mockgetByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
    });

    it('handles success', () => {
      const userInfo = {email: "person@person.com", pass: "Password99$"};
      const message = 'Confirmation code re-sent.';
        mockgetByEmail = jest.fn().mockResolvedValue([{
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
        const actual =
          await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
    });
  });

  describe('login method', () => {
  
  });
});
