import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import * as uuid from 'uuid';
import { v4 as uuidv4 } from 'uuid';

import { UserAuthController } from '../../../../src/controllers/user/auth';
import {
  emailConfirmationCode
} from '../../../../src/lib/services/email-confirmation-code';
import {
  validLogin,
  validLoginRequest,
  validRegister,
  validRegisterRequest,
  validResend,
  validUserCreation,
  validUserUpdate,
  validVerify,
  validVerifyRequest,
} from '../../../../src/lib/validations/user/index';

const pool: Partial<Pool> = {};
const controller = new UserAuthController(<Pool>pool);

jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
mockBcrypt.hash.mockResolvedValue(
  "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
);

jest.mock('superstruct');

jest.mock('uuid');
const mockUUID = uuid as jest.Mocked<typeof uuid>;
mockUUID.v4.mockReturnValue("123XYZ");

jest.mock('../../../../src/lib/services/email-confirmation-code', () => {
  const originalModule = jest
    .requireActual('../../../../src/lib/services/email-confirmation-code');
  return {...originalModule, emailConfirmationCode: jest.fn()};
});

jest.mock('../../../../src/mysql-access/User', () => ({
  User: jest.fn().mockImplementation(() => ({
    getByEmail: mockGetByEmail,
    getByName: mockGetByName,
    create: mockCreateUser,
    verify: mockVerifyUser,
    update: mockUpdateUser,
    delete: mockDeleteUser
  }))
}));
let mockGetByEmail = jest.fn();
let mockGetByName = jest.fn();
let mockCreateUser = jest.fn();
let mockVerifyUser = jest.fn();
let mockUpdateUser = jest.fn();
let mockDeleteUser = jest.fn();

jest.mock('../../../../src/mysql-access/Content', () => ({
  Content: jest.fn().mockImplementation(() => ({
    deleteAllByOwnerId: mockContentDeleteAllByOwnerId
  }))
}));
let mockContentDeleteAllByOwnerId = jest.fn();

jest.mock('../../../../src/mysql-access/Friendship', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    deleteAllByUserId: mockDeleteAllFriendshipsByUserId
  }))
}));
let mockDeleteAllFriendshipsByUserId = jest.fn();

jest.mock('../../../../src/mysql-access/Plan', () => ({
  Plan: jest.fn().mockImplementation(() => ({
    deleteAllByOwnerId: mockDeleteAllPlansByOwnerId
  }))
}));
let mockDeleteAllPlansByOwnerId = jest.fn();

jest.mock('../../../../src/mysql-access/FavoriteRecipe', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => ({
    deleteAllByUserId: mockDeleteAllFavoriteRecipesByUserId
  }))
}));
let mockDeleteAllFavoriteRecipesByUserId = jest.fn();

jest.mock('../../../../src/mysql-access/SavedRecipe', () => ({
  SavedRecipe: jest.fn().mockImplementation(() => ({
    deleteAllByUserId: mockDeleteAllSavedRecipesByUserId
  }))
}));
let mockDeleteAllSavedRecipesByUserId = jest.fn();

jest.mock('../../../../src/mysql-access/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => ({
    getAllPrivateIdsByUserId: mockGetAllPrivateIdsByUserId,
    disown: mockDisown,
    deletePrivate: mockDeletePrivate
  }))
}));
let mockGetAllPrivateIdsByUserId = jest.fn().mockResolvedValue([273, 837, 941]);
let mockDisown = jest.fn();
let mockDeletePrivate = jest.fn();

jest.mock('../../../../src/mysql-access/RecipeEquipment', () => ({
  RecipeEquipment: jest.fn().mockImplementation(() => ({
    deleteByRecipeIds: mockDeleteRecipeEquipmentByRecipeIds
  }))
}));
let mockDeleteRecipeEquipmentByRecipeIds = jest.fn();

jest.mock('../../../../src/mysql-access/RecipeIngredient', () => ({
  RecipeIngredient: jest.fn().mockImplementation(() => ({
    deleteByRecipeIds: mockDeleteRecipeIngredientsByRecipeIds
  }))
}));
let mockDeleteRecipeIngredientsByRecipeIds = jest.fn();

jest.mock('../../../../src/mysql-access/RecipeMethod', () => ({
  RecipeMethod: jest.fn().mockImplementation(() => ({
    deleteByRecipeIds: mockDeleteRecipeMethodsByRecipeIds
  }))
}));
let mockDeleteRecipeMethodsByRecipeIds = jest.fn();

jest.mock('../../../../src/mysql-access/RecipeSubrecipe', () => ({
  RecipeSubrecipe: jest.fn().mockImplementation(() => ({
    deleteByRecipeIds: mockDeleteRecipeSubrecipesByRecipeIds,
    deleteBySubrecipeIds: mockDeleteRecipeSubrecipesBySubrecipeIds
  }))
}));
let mockDeleteRecipeSubrecipesByRecipeIds = jest.fn();
let mockDeleteRecipeSubrecipesBySubrecipeIds = jest.fn();

jest.mock('../../../../src/mysql-access/Equipment', () => ({
  Equipment: jest.fn().mockImplementation(() => ({
    deleteAllByOwnerId: mockDeleteAllEquipmentByOwnerId
  }))
}));
let mockDeleteAllEquipmentByOwnerId = jest.fn();

jest.mock('../../../../src/mysql-access/Ingredient', () => ({
  Ingredient: jest.fn().mockImplementation(() => ({
    deleteAllByOwnerId: mockDeleteAllIngredientsByOwnerId
  }))
}));
let mockDeleteAllIngredientsByOwnerId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user auth controller', () => {

  describe('register method', () => {

    describe('when username is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "Name"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Username must be at least 6 characters.'
        })
      };

      it('uses assert on request correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            username: "Name"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Username must be at least 6 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual)
          .toEqual({message: 'Username must be at least 6 characters.'});
      });
    });

    describe('when username is longer than 20 chars', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "NameLongerThanTwentyCharacters"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Username must be no more than 20 characters.'
        })
      };

      it('uses assert on request correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            username: "NameLongerThanTwentyCharacters"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Username must be no more than 20 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual)
          .toEqual({message: 'Username must be no more than 20 characters.'});
      });
    });

    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Pa99$",
            username: "NameIsGood"
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
            username: "NameIsGood"
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
          userInfo: {
            email: "person@person.com",
            password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            username: "NameIsGood"
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
            username: "NameIsGood"
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

    describe('when username already taken', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Username already taken.'})
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
            username: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Username already taken.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Username already taken.'});
      });
    });

    describe('when email already in use', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "NameIsGood"
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
            username: "NameIsGood"
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
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            username: "NameIsGood"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User account created.'})
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
            username: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('uses bcrypt.hash correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(bcrypt.hash).toHaveBeenCalledWith("Password99$", 10);
      });

      it('uses uuidv4 correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(uuidv4).toBeCalledTimes(1);
      });

      it('uses assert on entity correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
            username: "NameIsGood",
            confirmationCode: "123XYZ"
          },
          validUserCreation
        );
      });

      it('uses createUser correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(mockCreateUser).toHaveBeenCalledWith({
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          username: "NameIsGood",
          confirmationCode: "123XYZ"
        });
      });

      it('uses emailConfirmationCode', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(emailConfirmationCode)
          .toHaveBeenCalledWith("person@person.com", "123XYZ");
      });

      it('sends data correctly', async () => {
        await controller.register(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'User account created.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.register(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User account created.'});
      });
    });

  });

  describe('verify method', () => {

    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Pa99$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Invalid password.'})
      };

      it('uses assert on request correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Pa99$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Invalid password.'})
      };

      it('uses assert on request correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when email does not exist', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'An issue occurred, please double check your info and try again.'
        })
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([]);
      });

      it('uses assert on request correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
    });

    describe('when password is incorrect', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "WrongPassword99$",
            confirmationCode: "123XYZ"
          }
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
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
      });

      it('uses assert on request correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "WrongPassword99$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Incorrect email or password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Incorrect email or password.'});
      });
    });

    describe('when the sent confirmation code is incorrect', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            confirmationCode: "456ABC"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'An issue occurred, please double check your info and try again.'
        })
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([{
          id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            confirmationCode: "456ABC"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
    });

    describe('when ok', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User account verified.'})
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([{
          id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it ('uses verifyUser correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(mockVerifyUser).toHaveBeenCalledWith("person@person.com");
      });

      it('sends data correctly', async () => {
        await controller.verify(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User account verified.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.verify(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User account verified.'});
      });
    });

  });

  describe('resendConfirmationCode method', () => {

    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Pa99$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Invalid password.'})
      };

      it('uses assert on request correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Pa99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller
          .resendConfirmationCode(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when password is longer than 54 chars', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Invalid password.'})
      };

      it('uses assert on request correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
          },
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller
          .resendConfirmationCode(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Invalid password.'});
      });
    });

    describe('when email does not exist', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            confirmationCode: "123XYZ"
          }
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
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Incorrect email or password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller
          .resendConfirmationCode(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Incorrect email or password.'});
      });
    });

    describe('when password is incorrect', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "WrongPassword99$",
            confirmationCode: "123XYZ"
          }
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
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(false);
      });

      it('uses assert on request correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "WrongPassword99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Incorrect email or password.'});
      });

      it('returns correctly', async () => {
        const actual = await controller
          .resendConfirmationCode(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Incorrect email or password.'});
      });
    });

    describe('when account is already verified', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Already verified.'})
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([{
          id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Already verified.'});
      });

      it('returns correctly', async () => {
        const actual = await controller
          .resendConfirmationCode(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already verified.'});
      });
    });

    describe('when ok', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {
            email: "person@person.com",
            password: "Password99$",
            confirmationCode: "123XYZ"
          }
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Confirmation code re-sent.'})
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([{
          id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      });

      it('uses assert on request correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('uses emailConfirmationCode', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(emailConfirmationCode)
          .toHaveBeenCalledWith("person@person.com", "123XYZ");
      });

      it('sends data correctly', async () => {
        await controller.resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Confirmation code re-sent.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller
          .resendConfirmationCode(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Confirmation code re-sent.'});
      });
    });

  });

  describe('login method', () => {
    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const req: Partial<Request> =
        {body: {userInfo: {email: "person@person.com", password: "Pa99$"}}};
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
          userInfo: {
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
          userInfo: {email: "person@person.com", password: "Password99$"}
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
          userInfo: {email: "person@person.com", password: "WrongPassword99$"}
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
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
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

    describe('when account is not yet verified', () => {
      const req: Partial<Request> = {
        body: {userInfo: {email: "person@person.com", password: "Password99$"}}
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Please check your email for your confirmation code.'
        })
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([{
          id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValue(true);
      })

      it('uses assert on request correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'Please check your email for your confirmation code.'
        });
      });

      it('returns correctly', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Please check your email for your confirmation code.'
        });
      });
    });

    describe ('when ok', () => {
      const req: Partial<Request> = {
        session: {...<Express.Session>{}},
        body: {
          userInfo: {email: "person@person.com", password: "Password99$"}
        }
      };
      const res: Partial<Response> = {
        json: jest.fn().mockResolvedValue({
          message: 'Signed in.',
          username: "NameIsGood",
          avatar: "NameIsGood"
        }),
        send: jest.fn()
      };

      beforeAll(() => {
        mockGetByEmail = jest.fn().mockResolvedValue([{
          id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          username: "NameIsGood",
          avatar: "NameIsGood",
          confirmation_code: null
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

      it('attaches userInfo object to session object', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(req.session!.userInfo)
          .toEqual({id: 150, username: "NameIsGood", avatar: "NameIsGood"});
      });

      it('sends data correctly', async () => {
        await controller.login(<Request>req, <Response>res);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Signed in.',
          username: "NameIsGood",
          avatar: "NameIsGood"
        });
      });

      it('returns correctly', async () => {
        const actual = await controller.login(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Signed in.',
          username: "NameIsGood",
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
        userInfo: {id: 150}
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
    const req: Partial<Request> = {
      session: {...<Express.Session>{}, userInfo: {id: 150}},
      body: {
        userInfo: {
          email: "person@person.com",
          password: "Password99$",
          username: "NameIsGood",
          avatar: "NameIsGood"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Account updated.'})};

    it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          email: "person@person.com",
          pass: "Password99$",
          username: "NameIsGood",
          avatar: "NameIsGood"
        },
        validUserUpdate
      );
    });

    it ('uses updateUser correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdateUser).toHaveBeenCalledWith({
        id: 150,
        email: "person@person.com",
        pass: "Password99$",
        username: "NameIsGood",
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

  describe('delete method', () => {
    const req: Partial<Request> =
      {session: {...<Express.Session>{}, userInfo: {id: 150}}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Account deleted.'})};

    // figure out how to test if the deletes are called in the correct order
    // (would you have to make it a generator function?)

    it('uses Content.deleteAllByOwnerId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockContentDeleteAllByOwnerId).toHaveBeenCalledWith(150);
    });

    it('uses Friendships correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteAllFriendshipsByUserId).toHaveBeenCalledWith(150);
    });

    it('uses Plan correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteAllPlansByOwnerId).toHaveBeenCalledWith(150);
    });

    it('uses FavoriteRecipe correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteAllFavoriteRecipesByUserId).toHaveBeenCalledWith(150);
    });

    it('uses SavedRecipe correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteAllSavedRecipesByUserId).toHaveBeenCalledWith(150);
    });

    it('uses Recipe.disown correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDisown).toHaveBeenCalledWith(150);
    });

    it('uses Recipe.getAllPrivateIdsByUserId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockGetAllPrivateIdsByUserId).toHaveBeenCalledWith(150);
    });

    it('uses RecipeEquipment.deleteByRecipeIds correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteRecipeEquipmentByRecipeIds)
        .toHaveBeenCalledWith([273, 837, 941]);
    });

    it('uses RecipeIngredients.deleteByRecipeIds correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteRecipeIngredientsByRecipeIds)
        .toHaveBeenCalledWith([273, 837, 941]);
    });

    it('uses RecipeMethods.deleteByRecipeIds correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteRecipeMethodsByRecipeIds)
        .toHaveBeenCalledWith([273, 837, 941]);
    });

    it('uses RecipeSubrecipes.deleteByRecipeIds correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteRecipeSubrecipesByRecipeIds)
        .toHaveBeenCalledWith([273, 837, 941]);
    });

    it('uses RecipeSubrecipes.deleteBySubrecipeIds correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteRecipeSubrecipesBySubrecipeIds)
        .toHaveBeenCalledWith([273, 837, 941]);
    });

    it('uses Recipe.deletePrivate correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeletePrivate).toHaveBeenCalledWith(150, 150);
    });

    it('uses Equipment.deleteAllByOwnerId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteAllEquipmentByOwnerId).toHaveBeenCalledWith(150);
    });

    it('uses Ingredient.deleteAllByOwnerId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteAllIngredientsByOwnerId).toHaveBeenCalledWith(150);
    });

    it('uses User.delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteUser).toHaveBeenCalledWith(150);
    });

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Account deleted.'});
    });

    it('returns correctly', async () => {
      const actual =
        await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Account deleted.'});
    });
  });
});