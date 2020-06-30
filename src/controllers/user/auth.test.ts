//const httpMocks = require('node-mocks-http');
//const request = require('supertest');
import { Request, Response } from 'express';
import { assert } from 'superstruct';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid'
import { v4 as uuidv4 } from 'uuid';

import {
  emailConfirmationCode
} from '../../lib/services/email-confirmation-code';
import {
  validRegisterRequest,
  validRegister,
  validUserEntity,
  validVerifyRequest,
  validVerify,
  validResend,
  validLoginRequest,
  validLogin,
  validUpdatingUser
} from '../../lib/validations/user/index';
import { userAuthController } from './auth';

jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
mockBcrypt.hash.mockResolvedValue(
  "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u"
);

jest.mock('superstruct');

jest.mock('uuid');
const mockUUID = uuid as jest.Mocked<typeof uuid>;
mockUUID.v4.mockReturnValue("123XYZ");

jest.mock('../../lib/services/email-confirmation-code', () => {
  const originalModule = jest
  .requireActual('../../lib/services/email-confirmation-code');
  return {...originalModule, emailConfirmationCode: jest.fn()};
});

jest.mock('../../mysql-access/User', () => {
  const originalModule = jest.requireActual('../../mysql-access/User');
  return {
    ...originalModule,
    User: jest.fn().mockImplementation(() => ({
      getUserByEmail: mockGetUserByEmail,
      getUserByName: mockGetUserByName,
      createUser: mockCreateUser,
      verifyUser: mockVerifyUser,
      updateUser: mockUpdateUser,
      deleteUser: mockDeleteUser
    }))
  };
});
let mockGetUserByEmail = jest.fn();
let mockGetUserByName = jest.fn();
let mockCreateUser = jest.fn();
let mockVerifyUser = jest.fn();
let mockUpdateUser = jest.fn();
let mockDeleteUser = jest.fn();

jest.mock('../../mysql-access/Content', () => {
  const originalModule = jest.requireActual('../../mysql-access/Content');
  return {
    ...originalModule,
    Content: jest.fn().mockImplementation(() => ({
      deleteAllMyContent: mockDeleteAllMyContent
    }))
  };
});
let mockDeleteAllMyContent = jest.fn();

jest.mock('../../mysql-access/Friendship', () => {
  const originalModule = jest.requireActual('../../mysql-access/Friendship');
  return {
    ...originalModule,
    Friendship: jest.fn().mockImplementation(() => ({
      deleteAllMyFriendships: mockDeleteAllMyFriendships
    }))
  };
});
let mockDeleteAllMyFriendships = jest.fn();

jest.mock('../../mysql-access/Plan', () => {
  const originalModule = jest.requireActual('../../mysql-access/Plan');
  return {
    ...originalModule,
    Plan: jest.fn().mockImplementation(() => ({
      deleteAllMyPrivatePlans: mockDeleteAllMyPrivatePlans
    }))
  };
});
let mockDeleteAllMyPrivatePlans = jest.fn();

jest.mock('../../mysql-access/FavoriteRecipe', () => {
  const originalModule = jest.requireActual('../../mysql-access/FavoriteRecipe');
  return {
    ...originalModule,
    FavoriteRecipe: jest.fn().mockImplementation(() => ({
      deleteAllMyFavoriteRecipes: mockDeleteAllMyFavoriteRecipes
    }))
  };
});
let mockDeleteAllMyFavoriteRecipes = jest.fn();

jest.mock('../../mysql-access/SavedRecipe', () => {
  const originalModule = jest.requireActual('../../mysql-access/SavedRecipe');
  return {
    ...originalModule,
    SavedRecipe: jest.fn().mockImplementation(() => ({
      deleteAllMySavedRecipes: mockDeleteAllMySavedRecipes
    }))
  };
});
let mockDeleteAllMySavedRecipes = jest.fn();

jest.mock('../../mysql-access/Recipe', () => {
  const originalModule = jest.requireActual('../../mysql-access/Recipe');
  return {
    ...originalModule,
    Recipe: jest.fn().mockImplementation(() => ({
      disownAllMyPublicUserRecipes: mockDisownAllMyPublicUserRecipes,
      deleteAllMyPrivateUserRecipes: mockDeleteAllMyPrivateUserRecipes
    }))
  };
});
let mockDisownAllMyPublicUserRecipes = jest.fn();
let mockDeleteAllMyPrivateUserRecipes = jest.fn();

jest.mock('../../mysql-access/Equipment', () => {
  const originalModule = jest.requireActual('../../mysql-access/Equipment');
  return {
    ...originalModule,
    Equipment: jest.fn().mockImplementation(() => ({
      deleteAllMyPrivateUserEquipment: mockDeleteAllMyPrivateUserEquipment
    }))
  };
});
let mockDeleteAllMyPrivateUserEquipment = jest.fn();

jest.mock('../../mysql-access/Ingredient', () => {
  const originalModule = jest.requireActual('../../mysql-access/Ingredient');
  return {
    ...originalModule,
    Ingredient: jest.fn().mockImplementation(() => ({
      deleteAllMyPrivateUserIngredients: mockDeleteAllMyPrivateUserIngredients
    }))
  };
});
let mockDeleteAllMyPrivateUserIngredients = jest.fn();

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
        await userAuthController.register(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            username: "Name"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Username must be at least 6 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Username must be at least 6 characters.'
        });
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
        await userAuthController.register(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            username: "NameLongerThanTwentyCharacters"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Username must be no more than 20 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Username must be no more than 20 characters.'
        });
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
        await userAuthController.register(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Pa99$",
            username: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Password must be at least 6 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Password must be at least 6 characters.'
        });
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
        await userAuthController.register(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            username: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Password must be no more than 54 characters.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Password must be no more than 54 characters.'
        });
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

      it('uses assert on request correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([{user_id: 150}]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            username: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([{user_id: 150}]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Username already taken.'});
      });
  
      it('returns correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([{user_id: 150}]);
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
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

      it('uses assert on request correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([{user_id: 150}]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            username: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([{user_id: 150}]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Email already in use.'});
      });
  
      it('returns correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([{user_id: 150}]);
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
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

      it('uses assert on request correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            username: "NameIsGood"
          },
          validRegisterRequest
        );
      });

      it('uses bcrypt.hash correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(bcrypt.hash).toBeCalledWith("Password99$", 10);
      });

      it('uses uuidv4 correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(uuidv4).toBeCalledTimes(1);
      });

      it('uses assert on entity correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
            username: "NameIsGood",
            confirmationCode: "123XYZ"
          },
          validUserEntity
        );
      });

      it('uses createUser correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(mockCreateUser).toBeCalledWith({
          email: "person@person.com",
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          username: "NameIsGood",
          confirmationCode: "123XYZ"
        });
      });

      it('uses emailConfirmationCode', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(emailConfirmationCode)
        .toHaveBeenCalledWith("person@person.com", "123XYZ");
      });

      it('sends data correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.register(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User account created.'});
      });
  
      it('returns correctly', async () => {
        mockGetUserByName = jest.fn().mockResolvedValue([]);
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        const actual = await userAuthController
        .register(<Request>req, <Response>res);
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
        await userAuthController.verify(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Pa99$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
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
        await userAuthController.verify(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "WrongPassword99$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Incorrect email or password.'
        });
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Incorrect email or password.'
        });
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            confirmationCode: "456ABC"
          },
          validVerifyRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'An issue occurred, please double check your info and try again.'
        });
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(assert).toBeCalledWith(
          {
            email: "person@person.com",
            pass: "Password99$",
            confirmationCode: "123XYZ"
          },
          validVerifyRequest
        );
      });

      it ('uses verifyUser correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(mockVerifyUser).toBeCalledWith("person@person.com");
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController.verify(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User account verified.'});
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        const actual = await userAuthController
        .verify(<Request>req, <Response>res);
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
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Pa99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
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
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
          },
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Incorrect email or password.'
        });
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        const actual = await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Incorrect email or password.'
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "WrongPassword99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Incorrect email or password.'
        });
      });

      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        const actual = await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Incorrect email or password.'
        });
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Already verified.'});
      });

      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        const actual = await userAuthController
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('uses emailConfirmationCode', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(emailConfirmationCode)
        .toHaveBeenCalledWith("person@person.com", "123XYZ");
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Confirmation code re-sent.'});
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        const actual = await userAuthController
        .resendConfirmationCode(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Confirmation code re-sent.'});
      });
    });

  });

  describe('login method', () => {
    // TO DO: unit test email regex
    //describe('when email', () => {});

    describe('when password is shorter than 6 chars', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {email: "person@person.com", password: "Pa99$"}
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Invalid password.'})
      };

      it('uses assert on request correctly', async () => {
        await userAuthController.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Pa99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController.login(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .login(<Request>req, <Response>res);
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
        await userAuthController.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            email: "person@person.com",
            pass: "PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$PasswordLongerThanFiftyFourCharacters999999999$",
          },
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        await userAuthController.login(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'Invalid password.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userAuthController
        .login(<Request>req, <Response>res);
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        await userAuthController.login(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Incorrect email or password.'
        });
      });
  
      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([]);
        const actual = await userAuthController
        .login(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Incorrect email or password.'
        });
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

      it('uses assert on request correctly', async () => {
        await userAuthController.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "WrongPassword99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        await userAuthController.login(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Incorrect email or password.'
        });
      });

      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        const actual = await userAuthController
        .login(<Request>req, <Response>res);
        expect(actual).toEqual({
          message: 'Incorrect email or password.'
        });
      });
    });

    describe('when account is not yet verified', () => {
      const req: Partial<Request> = {
        body: {
          userInfo: {email: "person@person.com", password: "Password99$"}
        }
      };
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Please check your email for your confirmation code.'
        })
      };

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController.login(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Please check your email for your confirmation code.'
        });
      });

      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          confirmation_code: "123XYZ"
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        const actual = await userAuthController
        .login(<Request>req, <Response>res);
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

      it('uses assert on request correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          username: "NameIsGood",
          avatar: "NameIsGood",
          confirmation_code: null
        }]);
        await userAuthController.login(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {email: "person@person.com", pass: "Password99$"},
          validLoginRequest
        );
      });

      it('attaches userInfo object to session object', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          username: "NameIsGood",
          avatar: "NameIsGood",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController.login(<Request>req, <Response>res);
        expect(req.session!.userInfo).toEqual({
          userId: 150,
          username: "NameIsGood",
          avatar: "NameIsGood"
        });
      });

      it('sends data correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          username: "NameIsGood",
          avatar: "NameIsGood",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        await userAuthController.login(<Request>req, <Response>res);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Signed in.',
          username: "NameIsGood",
          avatar: "NameIsGood"
        });
      });

      it('returns correctly', async () => {
        mockGetUserByEmail = jest.fn().mockResolvedValue([{
          user_id: 150,
          pass: "$2b$10$Bczm6Xs42fSsshB.snY1muuYWmnwylbDRN0r.AMAPihGDI4nJHB9u",
          username: "NameIsGood",
          avatar: "NameIsGood",
          confirmation_code: null
        }]);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        const actual = await userAuthController
        .login(<Request>req, <Response>res);
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
        userInfo: {userId: 150}
      }
    };
    const res: Partial<Response> = {end: jest.fn()};
    
    it('uses destroy', async () => {
      await userAuthController.logout(<Request>req, <Response>res);
      expect(mockDestroy).toBeCalledTimes(1);
    });

    it('uses res.end', async () => {
      await userAuthController.logout(<Request>req, <Response>res);
      expect(res.end).toBeCalledTimes(1);
    });
  });

  describe('updateUser method', () => {
    const req: Partial<Request> = {
      session: {...<Express.Session>{}, userInfo: {userId: 150}},
      body: {
        userInfo: {
          email: "person@person.com",
          password: "Password99$",
          username: "NameIsGood",
          avatar: "NameIsGood"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Account updated.'})
    };

    it('uses assert correctly', async () => {
      await userAuthController.updateUser(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          email: "person@person.com",
          pass: "Password99$",
          username: "NameIsGood",
          avatar: "NameIsGood"
        },
        validUpdatingUser
      );
    });

    it ('uses updateUser correctly', async () => {
      await userAuthController.updateUser(<Request>req, <Response>res);
      expect(mockUpdateUser).toBeCalledWith({
        userId: 150,
        email: "person@person.com",
        pass: "Password99$",
        username: "NameIsGood",
        avatar: "NameIsGood"
      });
    });

    it('sends data correctly', async () => {
      await userAuthController.updateUser(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Account updated.'});
    });

    it('returns correctly', async () => {
      const actual = await userAuthController
      .updateUser(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Account updated.'});
    });
  });

  describe('deleteUser method', () => {
    const req: Partial<Request> = {
      session: {...<Express.Session>{}, userInfo: {userId: 150}}
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Account deleted.'})
    };

    // figure out how to test if the deletes are called in the correct order
    // (would you have to make it a generator function?)

    it('uses deleteAllMyContent correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDeleteAllMyContent).toBeCalledWith(150);
    });

    it('uses deleteAllMyFriendships correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDeleteAllMyFriendships).toBeCalledWith(150);
    });

    it('uses deleteAllMyPrivatePlans correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDeleteAllMyPrivatePlans).toBeCalledWith(150);
    });

    it('uses deleteAllMyFavoriteRecipes correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDeleteAllMyFavoriteRecipes).toBeCalledWith(150);
    });

    it('uses deleteAllMySavedRecipes correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDeleteAllMySavedRecipes).toBeCalledWith(150);
    });

    it('uses disownAllMyPublicUserRecipes correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDisownAllMyPublicUserRecipes).toBeCalledWith(150);
    });

    it('uses deleteAllMyPrivateUserRecipes correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDeleteAllMyPrivateUserRecipes).toBeCalledWith(150, 150);
    });

    it('uses deleteAllMyPrivateUserEquipment correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDeleteAllMyPrivateUserEquipment).toBeCalledWith(150);
    });

    it('uses deleteAllMyPrivateUserIngredients correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDeleteAllMyPrivateUserIngredients).toBeCalledWith(150);
    });

    it('uses deleteUser correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(mockDeleteUser).toBeCalledWith(150);
    });

    it('sends data correctly', async () => {
      await userAuthController.deleteUser(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Account deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await userAuthController
      .deleteUser(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Account deleted.'});
    });
  });
});