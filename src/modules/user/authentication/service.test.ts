import { UserAuthenticationService } from "./service.js";
import { emailUser } from "../shared/simple-email-service.js";
import type { UserRepoInterface, UserData } from "../repo.js";

jest.mock('../shared/simple-email-service');
jest.mock('../repo');

const confirmation_code = "99999999-9999-9999-9999-999999999999";
const userData = {
  user_id: "99999999-9999-9999-9999-999999999999",
  email: "username@nobsc.com",
  username: "username",
  confirmation_code: "99999999-9999-9999-9999-999999999999"
} as UserData;

describe('UserAuthenticationService', () => {
  let emailUserMock: jest.Mocked<typeof emailUser>;
  let userRepoMock: jest.Mocked<UserRepoInterface>;
  let service: UserAuthenticationService;

  beforeEach(() => {
    emailUserMock = emailUser as unknown as jest.Mocked<typeof emailUser>;
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
    const params = {
      email: "username@nobsc.com",
      password: "password"
    };
    
    it('handles when user does not exist', async () => {
      userRepoMock.getByEmail.mockResolvedValue(undefined);
      try {
        await service.resendConfirmationCode(params);
      } catch (err: any) {
        expect(err.message).toBe("User does not exist.");
      }
      expect(emailUserMock).not.toHaveBeenCalled();
    });

    it('handles when already confirmed', async () => {
      const userData = {
        user_id: "99999999-9999-9999-9999-999999999999",
        email: "username@nobsc.com",
        username: "username",
        confirmation_code: null  // null means they're already confirmed
      } as UserData;
      userRepoMock.getByEmail.mockResolvedValue(userData);

      try {
        await service.resendConfirmationCode(params);
      } catch (err: any) {
        expect(err.message).toBe("Already confirmed.");
      }
      expect(emailUserMock).not.toHaveBeenCalled();
    });

    it('handles when password is incorrect', async () => {
      userRepoMock.getByEmail.mockResolvedValue(userData);
      userRepoMock.getPassword.mockResolvedValue("differentpassword");
      try {
        await service.resendConfirmationCode(params);
      } catch (err: any) {
        expect(err.message).toBe("Incorrect email or password.");
      }
      expect(emailUserMock).not.toHaveBeenCalled();
    });

    it('handles success', async () => {
      userRepoMock.getByEmail.mockResolvedValue(userData);
      userRepoMock.getPassword.mockResolvedValue("password");
      try {
        await service.resendConfirmationCode(params);
      } catch (err: any) {
        throw err;  // fail the test
      }
      expect(emailUserMock).toHaveBeenCalled();
    });
  });

  describe('login method', () => {
    const params = {
      email: "username@nobsc.com",
      password: "password"
    };
    
    it('handles when user does not exist', async () => {
      userRepoMock.getByEmail.mockResolvedValue(undefined);
      try {
        await service.login(params);
      } catch (err: any) {
        expect(err.message).toBe("User does not exist.");
      }
    });

    it('handles when user has not confirmed', async () => {
      userRepoMock.getByEmail.mockResolvedValue(userData);
      userRepoMock.getPassword.mockResolvedValue("password");
      try {
        await service.login(params);
      } catch (err: any) {
        expect(err.message).toBe("Please check your email for your confirmation code.");
      }
    });

    it('handles when password is incorrect', async () => {
      const userData = {
        user_id: "99999999-9999-9999-9999-999999999999",
        email: "username@nobsc.com",
        username: "username",
        confirmation_code: null
      } as UserData;
      userRepoMock.getByEmail.mockResolvedValue(userData);
      userRepoMock.getPassword.mockResolvedValue("differentpassword");

      try {
        await service.login(params);
      } catch (err: any) {
        expect(err.message).toBe("Incorrect email or password.");
      }
    });

    it('handles success', async () => {
      const userData = {
        user_id: "99999999-9999-9999-9999-999999999999",
        email: "username@nobsc.com",
        username: "username",
        confirmation_code: null
      } as UserData;
      userRepoMock.getByEmail.mockResolvedValue(userData);
      userRepoMock.getPassword.mockResolvedValue("password");
      
      try {
        const { user_id, username } = await service.login(params);
        expect(user_id).toEqual(userData.user_id);
        expect(username).toEqual(userData.username);
      } catch (err: any) {
        throw err;  // fail the test
      }
    });
  });
});
