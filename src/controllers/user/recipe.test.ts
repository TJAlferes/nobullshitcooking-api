import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { validRecipeEntity } from '../../lib/validations/recipe/recipeEntity';
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
      createRecipe: mockCreateRecipe,
      updateMyUserRecipe: mockUpdateMyUserRecipe,
      disownMyPublicUserRecipe: mockDisownMyPublicUserRecipe,
      deleteMyPrivateUserRecipe: mockDeleteMyPrivateUserRecipe
    }))
  };
});
let mockGetPublicRecipeForElasticSearchInsert = jest.fn().mockResolvedValue(
  [[{recipe_id: 5432}]]
);
let mockViewRecipes = jest.fn().mockResolvedValue(
  [[{recipe_id: 383}, {recipe_id: 5432}]]
);
let mockViewRecipeById = jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
let mockGetInfoToEditMyUserRecipe = jest.fn().mockResolvedValue(
  [[{recipe_id: 5432}]]
);
let mockCreateRecipe = jest.fn().mockResolvedValue({insertId: 5432});
let mockUpdateMyUserRecipe = jest.fn();
let mockDisownMyPublicUserRecipe = jest.fn();
let mockDeleteMyPrivateUserRecipe = jest.fn();

jest.mock('../../mysql-access/RecipeEquipment', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeEquipment');
  return {
    ...originalModule,
    RecipeEquipment: jest.fn().mockImplementation(() => ({
      createRecipeEquipment: mockCreateRecipeEquipment,
      updateRecipeEquipment: mockUpdateRecipeEquipment,
      deleteRecipeEquipment: mockDeleteRecipeEquipment
    }))
  };
});
let mockCreateRecipeEquipment = jest.fn();
let mockUpdateRecipeEquipment = jest.fn();
let mockDeleteRecipeEquipment = jest.fn();

jest.mock('../../mysql-access/RecipeIngredient', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeIngredient');
  return {
    ...originalModule,
    RecipeIngredient: jest.fn().mockImplementation(() => ({
      createRecipeIngredients: mockCreateRecipeIngredients,
      updateRecipeIngredients: mockUpdateRecipeIngredients,
      deleteRecipeIngredients: mockDeleteRecipeIngredients
    }))
  };
});
let mockCreateRecipeIngredients = jest.fn();
let mockUpdateRecipeIngredients = jest.fn();
let mockDeleteRecipeIngredients = jest.fn();

jest.mock('../../mysql-access/RecipeMethod', () => {
  const originalModule = jest.requireActual('../../mysql-access/RecipeMethod');
  return {
    ...originalModule,
    RecipeMethod: jest.fn().mockImplementation(() => ({
      createRecipeMethods: mockCreateRecipeMethods,
      updateRecipeMethods: mockUpdateRecipeMethods,
      deleteRecipeMethods: mockDeleteRecipeMethods
    }))
  };
});
let mockCreateRecipeMethods = jest.fn();
let mockUpdateRecipeMethods = jest.fn();
let mockDeleteRecipeMethods = jest.fn();

jest.mock('../../mysql-access/RecipeSubrecipe', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeSubrecipe');
  return {
    ...originalModule,
    RecipeSubrecipe: jest.fn().mockImplementation(() => ({
      createRecipeSubrecipes: mockCreateRecipeSubrecipes,
      updateRecipeSubrecipes: mockUpdateRecipeSubrecipes,
      deleteRecipeSubrecipes: mockDeleteRecipeSubrecipes,
      deleteRecipeSubrecipesBySubrecipeId: mockDeleteRecipeSubrecipesBySubrecipeId
    }))
  };
});
let mockCreateRecipeSubrecipes = jest.fn();
let mockUpdateRecipeSubrecipes = jest.fn();
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

    it('sends data correctly', async () => {
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

    it('sends data correctly', async () => {
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

    it('sends data correctly', async () => {
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

    it('sends data correctly', async () => {
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

    it('sends data correctly', async () => {
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

    it('sends data correctly', async () => {
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
    const req: Partial<Request> = {
      session,
      body: {
        recipeInfo: {
          recipeTypeId: 2,
          cuisineId: 2,
          title: "My Recipe",
          description: "Tasty.",
          directions: "Do this, then that.",
          requiredMethods: [{methodId: 2}, {methodId: 5}],
          requiredEquipment: [
            {amount: 1, equipment: 2},
            {amount: 3, equipment: 5}
          ],
          requiredIngredients: [
            {amount: 5, unit: 4, ingredient: 2},
            {amount: 2, unit: 4, ingredient: 5}
          ],
          requiredSubrecipes: [{amount: 1, unit: 1, subrecipe: 48}],
          recipeImage: "nobsc-recipe-default",
          recipeEquipmentImage: "nobsc-recipe-equipment-default",
          recipeIngredientsImage: "nobsc-recipe-ingredients-default",
          recipeCookingImage: "nobsc-recipe-cooking-default",
          ownership: "public"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe created.'})
    };

    it('uses assert correctly', async () => {
      await userRecipeController.createRecipe(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          recipeTypeId: 2,
          cuisineId: 2,
          authorId: 150,
          ownerId: 1,
          title: "My Recipe",
          description: "Tasty.",
          directions: "Do this, then that.",
          recipeImage: "nobsc-recipe-default",
          equipmentImage: "nobsc-recipe-equipment-default",
          ingredientsImage: "nobsc-recipe-ingredients-default",
          cookingImage: "nobsc-recipe-cooking-default"
        },
        validRecipeEntity
      );
    });

    it('uses createRecipe correctly', async () => {
      await userRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipe).toBeCalledWith({
        recipeTypeId: 2,
        cuisineId: 2,
        authorId: 150,
        ownerId: 1,
        title: "My Recipe",
        description: "Tasty.",
        directions: "Do this, then that.",
        recipeImage: "nobsc-recipe-default",
        equipmentImage: "nobsc-recipe-equipment-default",
        ingredientsImage: "nobsc-recipe-ingredients-default",
        cookingImage: "nobsc-recipe-cooking-default"
      });
    });

    it('uses createRecipeMethods correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipeMethods).toBeCalledWith(
        [5432, 2, 5432, 5],
        '(?, ?),(?, ?)'
      );
    });

    it('uses createRecipeEquipment correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipeEquipment).toBeCalledWith(
        [5432, 2, 1, 5432, 5, 3],
        '(?, ?, ?),(?, ?, ?)'
      );
    });

    it('uses createRecipeIngredients correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipeIngredients).toBeCalledWith(
        [5432, 2, 5, 4, 5432, 5, 2, 4],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
      );
    });

    it('uses createRecipeSubrecipes correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipeSubrecipes).toBeCalledWith(
        [5432, 48, 1, 1],
        '(?, ?, ?, ?)'
      );
    });

    it('uses getPublicRecipeForElasticSearchInsert correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockGetPublicRecipeForElasticSearchInsert).toBeCalledWith(5432);
    });

    it('uses saveRecipe correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .createRecipe(<Request>req, <Response>res);
      expect(mockSaveRecipe).toHaveBeenCalledWith({recipe_id: 5432});
    });

    it('sends data correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController.createRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Recipe created.'});
    });

    it('returns correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      const actual = await userRecipeController
      .createRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe created.'});
    });
  });

  describe ('updateMyUserRecipe method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        recipeInfo: {
          recipeId: 5432,
          recipeTypeId: 2,
          cuisineId: 2,
          title: "My Recipe",
          description: "Tasty.",
          directions: "Do this, then that.",
          requiredMethods: [{methodId: 2}, {methodId: 5}],
          requiredEquipment: [
            {amount: 1, equipment: 2},
            {amount: 3, equipment: 5}
          ],
          requiredIngredients: [
            {amount: 5, unit: 4, ingredient: 2},
            {amount: 2, unit: 4, ingredient: 5}
          ],
          requiredSubrecipes: [{amount: 1, unit: 1, subrecipe: 49}],
          recipeImage: "nobsc-recipe-default",
          recipeEquipmentImage: "nobsc-recipe-equipment-default",
          recipeIngredientsImage: "nobsc-recipe-ingredients-default",
          recipeCookingImage: "nobsc-recipe-cooking-default",
          ownership: "public"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe updated.'})
    };

    it('uses assert correctly', async () => {
      await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          recipeTypeId: 2,
          cuisineId: 2,
          authorId: 150,
          ownerId: 1,
          title: "My Recipe",
          description: "Tasty.",
          directions: "Do this, then that.",
          recipeImage: "nobsc-recipe-default",
          equipmentImage: "nobsc-recipe-equipment-default",
          ingredientsImage: "nobsc-recipe-ingredients-default",
          cookingImage: "nobsc-recipe-cooking-default"
        },
        validRecipeEntity
      );
    });

    it ('uses updateMyUserRecipe correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(mockUpdateMyUserRecipe).toBeCalledWith({
        recipeId: 5432,
        recipeTypeId: 2,
        cuisineId: 2,
        authorId: 150,
        ownerId: 1,
        title: "My Recipe",
        description: "Tasty.",
        directions: "Do this, then that.",
        recipeImage: "nobsc-recipe-default",
        equipmentImage: "nobsc-recipe-equipment-default",
        ingredientsImage: "nobsc-recipe-ingredients-default",
        cookingImage: "nobsc-recipe-cooking-default"
      });
    });

    it('uses updateRecipeMethods correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(mockUpdateRecipeMethods).toBeCalledWith(
        [5432, 2, 5432, 5],
        '(?, ?),(?, ?)',
        5432
      );
    });

    it('uses createRecipeEquipment correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(mockUpdateRecipeEquipment).toBeCalledWith(
        [5432, 2, 1, 5432, 5, 3],
        '(?, ?, ?),(?, ?, ?)',
        5432
      );
    });

    it('uses createRecipeIngredients correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(mockUpdateRecipeIngredients).toBeCalledWith(
        [5432, 2, 5, 4, 5432, 5, 2, 4],
        '(?, ?, ?, ?),(?, ?, ?, ?)',
        5432
      );
    });

    it('uses createRecipeSubrecipes correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(mockUpdateRecipeSubrecipes).toBeCalledWith(
        [5432, 49, 1, 1],
        '(?, ?, ?, ?)',
        5432
      );
    });

    it('uses getPublicRecipeForElasticSearchInsert correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(mockGetPublicRecipeForElasticSearchInsert).toBeCalledWith(5432);
    });

    it('uses saveRecipe correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(mockSaveRecipe).toHaveBeenCalledWith({recipe_id: 5432});
    });

    it('sends data correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Recipe updated.'});
    });

    it('returns correctly', async () => {
      mockGetPublicRecipeForElasticSearchInsert =
        jest.fn().mockResolvedValue([[{recipe_id: 5432}]]);
      const actual = await userRecipeController
      .updateMyUserRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe updated.'});
    });
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

    it('sends data correctly', async () => {
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

    it('sends data correctly', async () => {
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