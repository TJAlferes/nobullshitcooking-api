import { ImageRepo } from '../image/repo';
import { PlanRepo } from '../plan/repo';
import { RecipeRepo } from '../recipe/repo';
import { EquipmentRepo } from '../equipment/repo';
import { IngredientRepo } from '../ingredient/repo';
import { NOBSC_USER_ID, UNKNOWN_USER_ID } from "../shared/model";
import { UserService } from "./service";
import type { UserRepoInterface, UserData } from "./repo";

jest.mock('../image/repo');
jest.mock('../plan/repo');
jest.mock('../recipe/repo');
jest.mock('../equipment/repo');
jest.mock('../ingredient/repo');

const imageRepoMock = ImageRepo as unknown as jest.Mocked<ImageRepo>;
const planRepoMock = PlanRepo as unknown as jest.Mocked<PlanRepo>;
const recipeRepoMock = RecipeRepo as unknown as jest.Mocked<RecipeRepo>;
const equipmentRepoMock = EquipmentRepo as unknown as jest.Mocked<EquipmentRepo>;
const ingredientRepoMock = IngredientRepo as unknown as jest.Mocked<IngredientRepo>;

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
    const params = {
      user_id: "99999999-9999-9999-9999-999999999999",
      new_email: "newemail@newemail.com"
    };

    it('handles when user does not exist', async () => {
      userRepoMock.getByUserId.mockResolvedValue(undefined);
      try {
        await userService.updateEmail(params);
      } catch (err: any) {
        expect(err.message).toBe("User does not exist.");
      }
    });

    it('handles success', async () => {
      userRepoMock.getByUserId.mockResolvedValue(userData);
      try {
        await userService.updateEmail(params);
      } catch (err: any) {
        throw err;  // fail the test
      }
    });
  });

  describe('updatePassword method', () => {
    const params = {
      user_id: "99999999-9999-9999-9999-999999999999",
      new_password: "newpassword"
    };

    it('handles when user does not exist', async () => {
      userRepoMock.getByUserId.mockResolvedValue(undefined);
      try {
        await userService.updatePassword(params);
      } catch (err: any) {
        expect(err.message).toBe("User does not exist.");
      }
    });

    it('handles success', async () => {
      userRepoMock.getByUserId.mockResolvedValue(userData);
      try {
        await userService.updatePassword(params);
      } catch (err: any) {
        throw err;  // fail the test
      }
    });
  });

  describe('updateUsername method', () => {
    const params = {
      user_id: "99999999-9999-9999-9999-999999999999",
      new_username: "newusername"
    };

    it('handles when user does not exist', async () => {
      userRepoMock.getByUserId.mockResolvedValue(undefined);
      try {
        await userService.updateUsername(params);
      } catch (err: any) {
        expect(err.message).toBe("User does not exist.");
      }
    });

    it('handles success', async () => {
      userRepoMock.getByUserId.mockResolvedValue(userData);
      try {
        await userService.updateUsername(params);
      } catch (err: any) {
        throw err;  // fail the test
      }
    });
  });

  describe('delete method', () => {
    imageRepoMock.unattributeAll.mockResolvedValue();
    imageRepoMock.deleteAll.mockResolvedValue();
    planRepoMock.unattributeAll.mockResolvedValue();
    planRepoMock.deleteAll.mockResolvedValue();
    recipeRepoMock.unattributeAll.mockResolvedValue();
    recipeRepoMock.deleteAll.mockResolvedValue();
    equipmentRepoMock.deleteAll.mockResolvedValue();
    ingredientRepoMock.deleteAll.mockResolvedValue();
    // delete their chatgroups???
    
    it('handles when user_id is NOBSC_USER_ID', async () => {
      try {
        await userService.delete(NOBSC_USER_ID);
      } catch (err: any) {
        expect(err.message).toBe("Forbidden.");
      }
      expect(userRepoMock.delete).not.toHaveBeenCalled();
    });

    it('handles when user_id is UNKNOWN_USER_ID', async () => {
      try {
        await userService.delete(UNKNOWN_USER_ID);
      } catch (err: any) {
        expect(err.message).toBe("Forbidden.");
      }
      expect(userRepoMock.delete).not.toHaveBeenCalled();
    });

    it('handles success', async () => {
      const user_id = "99999999-9999-9999-9999-999999999999";
      try {
        await userService.delete(user_id);
      } catch (err: any) {
        throw err;  // fail the test
      }
      expect(userRepoMock.delete).toHaveBeenCalledWith(user_id);
    });
  });
});
