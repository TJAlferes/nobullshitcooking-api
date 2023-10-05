import { UserService } from "./service";
import type { UserRepoInterface, UserData } from "./repo";

jest.mock('./repo');

const userData = {
  user_id: "99999999-9999-9999-9999-999999999999",
  email: "username@nobsc.com",
  username: "username",
  confirmation_code: "99999999-9999-9999-9999-999999999999"
} as UserData;

describe('UserService', () => {
  let userRepoMock: jest.Mocked<UserRepoInterface>;
  let userService: UserService;

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
    userService = new UserService(userRepoMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
    const params = {
      email: "username@nobsc.com",
      password: "password",
      username: "username"
    };

    it('handles when email already exists', async () => {
      userRepoMock.getByEmail.mockResolvedValue(userData);
      try {
        await userService.create(params);
      } catch (err: any) {
        expect(err.message).toBe("Email already in use.");
      }
    });

    it('handles when username already exists', async () => {
      userRepoMock.getByEmail.mockResolvedValue(undefined);
      userRepoMock.getByUsername.mockResolvedValue(userData);
      try {
        await userService.create(params);
      } catch (err: any) {
        expect(err.message).toBe("Username already in use.");
      }
    });

    it('handles success', async () => {
      userRepoMock.getByEmail.mockResolvedValue(undefined);
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      try {
        await userService.create(params);
      } catch (err: any) {
        throw err;  // If an error is thrown in this successful case, we fail the test
      }
    });
  });

  describe('updateEmail method', () => {
  
  });

  describe('updatePassword method', () => {
  
  });

  describe('updateUsername method', () => {
  
  });

  describe('delete method', () => {
  
  });
});
