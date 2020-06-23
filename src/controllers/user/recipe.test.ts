import { Request, Response } from 'express';
import { assert } from 'superstruct';
//import { mocked } from 'ts-jest/utils';

//
import { userRecipeController } from './recipe';

jest.mock('superstruct');

jest.mock('../../lib/connections/elasticsearchClient');

jest.mock('../../lib/connections/mysqlPoolConnection');

jest.mock('../../elasticsearch-access/RecipeSearch', () => {
  const originalModule = jest
  .requireActual('../../elasticsearch-access/RecipeSearch');
  return {
    ...originalModule,
    RecipeSearch: jest.fn().mockImplementation(() => ({
      saveRecipe: mockSaveRecipe
    }))
  };
});
let mockSaveRecipe = jest.fn();

jest.mock('../../mysql-access/Recipe', () => {
  const originalModule = jest.requireActual('../../mysql-access/Recipe');
  return {
    ...originalModule,
    Recipe: jest.fn().mockImplementation(() => ({
      getPublicRecipeForElasticSearchInsert: mockGetPublicRecipeForElasticSearchInsert,
      viewRecipes: mockViewRecipes,
      viewRecipeById: mockViewRecipeById,
      getInfoToEditMyUserRecipe: mockGetInfoToEditMyUserRecipe,
      //
      //
      disownMyPublicUserRecipe: mockDisownMyPublicUserRecipe,
      deleteMyPrivateUserRecipe: mockDeleteMyPrivateUserRecipe
    }))
  };
});
let mockGetPublicRecipeForElasticSearchInsert = jest.fn();
let mockViewRecipes = jest.fn().mockResolvedValue(
  [[{recipe_id: 383}, {recipe_id: 5432}]]
);
let mockViewRecipeById = jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
let mockGetInfoToEditMyUserRecipe = jest.fn().mockResolvedValue(
  [[{recipe_id: 5432}]]
);
//
//
let mockDisownMyPublicUserRecipe = jest.fn();
let mockDeleteMyPrivateUserRecipe = jest.fn();

jest.mock('../../mysql-access/RecipeEquipment', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeEquipment');
  return {
    ...originalModule,
    RecipeEquipment: jest.fn().mockImplementation(() => ({
      deleteRecipeEquipment: mockDeleteRecipeEquipment
    }))
  };
});
let mockDeleteRecipeEquipment = jest.fn();

jest.mock('../../mysql-access/RecipeIngredient', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeIngredient');
  return {
    ...originalModule,
    RecipeIngredient: jest.fn().mockImplementation(() => ({
      deleteRecipeIngredients: mockDeleteRecipeIngredients
    }))
  };
});
let mockDeleteRecipeIngredients = jest.fn();

jest.mock('../../mysql-access/RecipeMethod', () => {
  const originalModule = jest.requireActual('../../mysql-access/RecipeMethod');
  return {
    ...originalModule,
    RecipeMethod: jest.fn().mockImplementation(() => ({
      deleteRecipeMethods: mockDeleteRecipeMethods
    }))
  };
});
let mockDeleteRecipeMethods = jest.fn();

jest.mock('../../mysql-access/RecipeSubrecipe', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeSubrecipe');
  return {
    ...originalModule,
    RecipeSubrecipe: jest.fn().mockImplementation(() => ({
      deleteRecipeSubrecipes: mockDeleteRecipeSubrecipes,
      deleteRecipeSubrecipesBySubrecipeId: mockDeleteRecipeSubrecipesBySubrecipeId
    }))
  };
});
let mockDeleteRecipeSubrecipes = jest.fn();
let mockDeleteRecipeSubrecipesBySubrecipeId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user recipe controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 150}};

  describe('viewAllMyPrivateUserRecipes method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([[{recipe_id: 383}, {recipe_id: 5432}]])
    };

    it('uses viewRecipes correctly', async () => {
      await userRecipeController
      .viewAllMyPrivateUserRecipes(<Request>req, <Response>res);
      expect(mockViewRecipes).toHaveBeenCalledWith(150, 150);
    });

    it('sends data', async () => {
      await userRecipeController
      .viewAllMyPrivateUserRecipes(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([[{recipe_id: 383}, {recipe_id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
      .viewAllMyPrivateUserRecipes(<Request>req, <Response>res);
      expect(actual).toEqual([[{recipe_id: 383}, {recipe_id: 5432}]]);
    });
  });

  describe('viewAllMyPublicUserRecipes method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([[{recipe_id: 383}, {recipe_id: 5432}]])
    };

    it('uses viewRecipes correctly', async () => {
      await userRecipeController
      .viewAllMyPublicUserRecipes(<Request>req, <Response>res);
      expect(mockViewRecipes).toHaveBeenCalledWith(150, 1);
    });

    it('sends data', async () => {
      await userRecipeController
      .viewAllMyPublicUserRecipes(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([[{recipe_id: 383}, {recipe_id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
      .viewAllMyPublicUserRecipes(<Request>req, <Response>res);
      expect(actual).toEqual([[{recipe_id: 383}, {recipe_id: 5432}]]);
    });
  });

  describe('viewMyPrivateUserRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([{recipe_id: 5432}])
    };

    it('uses viewRecipeById correctly', async () => {
      await userRecipeController
      .viewMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(mockViewRecipeById).toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data', async () => {
      await userRecipeController
      .viewMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([{recipe_id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
      .viewMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(actual).toEqual([{recipe_id: 5432}]);
    });
  });

  describe('viewMyPublicUserRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([{recipe_id: 5432}])
    };

    it('uses viewRecipeById correctly', async () => {
      await userRecipeController
      .viewMyPublicUserRecipe(<Request>req, <Response>res);
      expect(mockViewRecipeById).toHaveBeenCalledWith(5432, 150, 1);
    });

    it('sends data', async () => {
      await userRecipeController
      .viewMyPublicUserRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([{recipe_id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
      .viewMyPublicUserRecipe(<Request>req, <Response>res);
      expect(actual).toEqual([{recipe_id: 5432}]);
    });
  });

  describe('getInfoToEditMyPrivateUserRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([{recipe_id: 5432}])
    };

    it('uses getInfoToEditMyUserRecipe correctly', async () => {
      await userRecipeController
      .getInfoToEditMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(mockGetInfoToEditMyUserRecipe)
      .toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data', async () => {
      await userRecipeController
      .getInfoToEditMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([{recipe_id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
      .getInfoToEditMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(actual).toEqual([{recipe_id: 5432}]);
    });
  });

  describe('getInfoToEditMyPublicUserRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([{recipe_id: 5432}])
    };

    it('uses getInfoToEditMyUserRecipe correctly', async () => {
      await userRecipeController
      .getInfoToEditMyPublicUserRecipe(<Request>req, <Response>res);
      expect(mockGetInfoToEditMyUserRecipe)
      .toHaveBeenCalledWith(5432, 150, 1);
    });

    it('sends data', async () => {
      await userRecipeController
      .getInfoToEditMyPublicUserRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([{recipe_id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
      .getInfoToEditMyPublicUserRecipe(<Request>req, <Response>res);
      expect(actual).toEqual([{recipe_id: 5432}]);
    });
  });

  describe ('createRecipe method', () => {
    // this needs tight validation, front-end validation is not enough
    const req: Partial<Request> = {
      session,
      body: {
        userInfo: {
          recipeTypeId: 2,
          cuisineId: 2,
          title: "My Recipe",
          description: "Tasty.",
          directions: "Do this, then that.",
          requiredMethods: [2, 5],
          requiredEquipment: [2, 5],
          requiredIngredients: [2, 5],
          requiredSubrecipes: [],
          recipeImage: "nobsc-recipe-default",
          equipmentImage: "nobsc-recipe-equipment-default",
          ingredientsImage: "nobsc-recipe-ingredients-default",
          cookingImage: "nobsc-recipe-cooking-default",
          ownership: "private"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe deleted.'})
    };


  });

  describe ('updateMyUserRecipe method', () => {
    // this needs tight validation, front-end validation is not enough
    const req: Partial<Request> = {
      session,
      body: {
        userInfo: {
          recipeId: 5432,
          recipeTypeId: 2,
          cuisineId: 2,
          title: "My Recipe",
          description: "Tasty.",
          directions: "Do this, then that.",
          requiredMethods: [2, 5],
          requiredEquipment: [2, 5],
          requiredIngredients: [2, 5],
          requiredSubrecipes: [],
          recipeImage: "nobsc-recipe-default",
          equipmentImage: "nobsc-recipe-equipment-default",
          ingredientsImage: "nobsc-recipe-ingredients-default",
          cookingImage: "nobsc-recipe-cooking-default",
          ownership: "private"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe deleted.'})
    };


  });

  describe ('deleteMyPrivateUserRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe deleted.'})
    };

    it('uses deleteRecipeEquipment correctly', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeEquipment).toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeIngredients correctly', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeIngredients).toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeMethods correctly', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeMethods).toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeSubrecipes correctly', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeSubrecipes).toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeSubrecipesBySubrecipeId correctly', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeSubrecipesBySubrecipeId)
      .toHaveBeenCalledWith(5432);
    });

    it('uses deleteMyPrivateUserRecipe correctly', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(mockDeleteMyPrivateUserRecipe)
      .toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data', async () => {
      await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Recipe deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
      .deleteMyPrivateUserRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe deleted.'});
    });
  });

  describe ('disownMyPublicUserRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe disowned.'})
    };

    it('uses disownMyPublicUserRecipe correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .disownMyPublicUserRecipe(<Request>req, <Response>res);
      expect(mockDisownMyPublicUserRecipe).toBeCalledWith(5432, 150);
    });

    it('uses getPublicRecipeForElasticSearchInsert correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .disownMyPublicUserRecipe(<Request>req, <Response>res);
      expect(mockGetPublicRecipeForElasticSearchInsert).toBeCalledWith(5432);
    });

    it('uses saveRecipe correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .disownMyPublicUserRecipe(<Request>req, <Response>res);
      expect(mockSaveRecipe).toHaveBeenCalledWith({recipe_id: 5432});
    });

    it('sends data', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .disownMyPublicUserRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Recipe disowned.'});
    });

    it('returns correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      const actual = await userRecipeController
      .disownMyPublicUserRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe disowned.'});
    });
  });
});