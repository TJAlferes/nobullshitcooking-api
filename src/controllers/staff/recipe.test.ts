import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { validRecipeEntity } from '../../lib/validations/recipe/recipeEntity';
import { staffRecipeController } from './recipe';

jest.mock('superstruct');

jest.mock('../../elasticsearch-access/RecipeSearch', () => {
  const originalModule = jest
  .requireActual('../../elasticsearch-access/RecipeSearch');
  return {
    ...originalModule,
    RecipeSearch: jest.fn().mockImplementation(() => ({
      saveRecipe: mockSaveRecipe,
      deleteRecipe: mockESDeleteRecipe
    }))
  };
});
let mockSaveRecipe = jest.fn();
let mockESDeleteRecipe = jest.fn();

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
      updateRecipe: mockUpdateRecipe,
      disownMyPublicUserRecipe: mockDisownMyPublicUserRecipe,
      deleteRecipe: mockDeleteRecipe
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
let mockUpdateRecipe = jest.fn();
let mockDisownMyPublicUserRecipe = jest.fn();
let mockDeleteRecipe = jest.fn();

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

jest.mock('../../mysql-access/FavoriteRecipe', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/FavoriteRecipe');
  return {
    ...originalModule,
    FavoriteRecipe: jest.fn().mockImplementation(() => ({
      deleteAllFavoritesOfRecipe: mockDeleteAllFavoritesOfRecipe
    }))
  };
});
let mockDeleteAllFavoritesOfRecipe = jest.fn();

jest.mock('../../mysql-access/SavedRecipe', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/SavedRecipe');
  return {
    ...originalModule,
    SavedRecipe: jest.fn().mockImplementation(() => ({
      deleteAllSavesOfRecipe: mockDeleteAllSavesOfRecipe
    }))
  };
});
let mockDeleteAllSavesOfRecipe = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff recipe controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 15}};

  //getInfoToEdit?

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
      await staffRecipeController.createRecipe(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          recipeTypeId: 2,
          cuisineId: 2,
          authorId: 1,
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
      await staffRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipe).toBeCalledWith({
        recipeTypeId: 2,
        cuisineId: 2,
        authorId: 1,
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
      await staffRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipeMethods).toBeCalledWith(
        [5432, 2, 5432, 5],
        '(?, ?),(?, ?)'
      );
    });

    it('uses createRecipeEquipment correctly', async () => {
      await staffRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipeEquipment).toBeCalledWith(
        [5432, 2, 1, 5432, 5, 3],
        '(?, ?, ?),(?, ?, ?)'
      );
    });

    it('uses createRecipeIngredients correctly', async () => {
      await staffRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipeIngredients).toBeCalledWith(
        [5432, 2, 5, 4, 5432, 5, 2, 4],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
      );
    });

    it('uses createRecipeSubrecipes correctly', async () => {
      await staffRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockCreateRecipeSubrecipes).toBeCalledWith(
        [5432, 48, 1, 1],
        '(?, ?, ?, ?)'
      );
    });

    it('uses getPublicRecipeForElasticSearchInsert correctly', async () => {
      await staffRecipeController.createRecipe(<Request>req, <Response>res);
      expect(mockGetPublicRecipeForElasticSearchInsert).toBeCalledWith(5432);
    });

    it('uses saveRecipe correctly', async () => {
      await staffRecipeController
      .createRecipe(<Request>req, <Response>res);
      expect(mockSaveRecipe).toHaveBeenCalledWith({recipe_id: 5432});
    });

    it('sends data correctly', async () => {
      await staffRecipeController.createRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Recipe created.'});
    });

    it('returns correctly', async () => {
      const actual = await staffRecipeController
      .createRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe created.'});
    });
  });

  describe ('updateRecipe method', () => {
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
      await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          recipeTypeId: 2,
          cuisineId: 2,
          authorId: 1,
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

    it ('uses updateRecipe correctly', async () => {
      await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(mockUpdateRecipe).toBeCalledWith({
        recipeId: 5432,
        recipeTypeId: 2,
        cuisineId: 2,
        authorId: 1,
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
      await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(mockUpdateRecipeMethods).toBeCalledWith(
        [5432, 2, 5432, 5],
        '(?, ?),(?, ?)',
        5432
      );
    });

    it('uses createRecipeEquipment correctly', async () => {
      await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(mockUpdateRecipeEquipment).toBeCalledWith(
        [5432, 2, 1, 5432, 5, 3],
        '(?, ?, ?),(?, ?, ?)',
        5432
      );
    });

    it('uses createRecipeIngredients correctly', async () => {
      await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(mockUpdateRecipeIngredients).toBeCalledWith(
        [5432, 2, 5, 4, 5432, 5, 2, 4],
        '(?, ?, ?, ?),(?, ?, ?, ?)',
        5432
      );
    });

    it('uses createRecipeSubrecipes correctly', async () => {
      await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(mockUpdateRecipeSubrecipes).toBeCalledWith(
        [5432, 49, 1, 1],
        '(?, ?, ?, ?)',
        5432
      );
    });

    it('uses getPublicRecipeForElasticSearchInsert correctly', async () => {
      await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(mockGetPublicRecipeForElasticSearchInsert).toBeCalledWith(5432);
    });

    it('uses saveRecipe correctly', async () => {
      await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(mockSaveRecipe).toHaveBeenCalledWith({recipe_id: 5432});
    });

    it('sends data correctly', async () => {
      await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Recipe updated.'});
    });

    it('returns correctly', async () => {
      const actual = await staffRecipeController
      .updateRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe updated.'});
    });
  });

  describe ('deleteRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe deleted.'})
    };

    it('uses deleteAllFavoritesOfRecipe correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(mockDeleteAllFavoritesOfRecipe).toHaveBeenCalledWith(5432);
    });

    it('uses deleteAllSavesOfRecipe correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(mockDeleteAllSavesOfRecipe).toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeEquipment correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeEquipment).toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeIngredients correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeIngredients).toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeMethods correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeMethods).toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeSubrecipes correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeSubrecipes).toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeSubrecipesBySubrecipeId correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipeSubrecipesBySubrecipeId)
      .toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipe correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(mockDeleteRecipe)
      .toHaveBeenCalledWith(5432);
    });

    it('uses ElasticSearch deleteRecipe correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(mockESDeleteRecipe)
      .toHaveBeenCalledWith(String(5432));
    });

    it('sends data correctly', async () => {
      await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Recipe deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await staffRecipeController
      .deleteRecipe(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe deleted.'});
    });
  });
});