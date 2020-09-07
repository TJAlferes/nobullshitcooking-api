import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  staffRecipeController
} from '../../../../src/controllers/staff/recipe';
import {
  validRecipeEntity
} from '../../../../src/lib/validations/recipe/entity';

jest.mock('superstruct');

jest.mock('../../../../src/elasticsearch-access/RecipeSearch', () => ({
  RecipeSearch: jest.fn().mockImplementation(() => ({
    save: mockESSave,
    delete: mockESDelete
  }))
}));
let mockESSave = jest.fn();
let mockESDelete = jest.fn();

jest.mock('../../../../src/mysql-access/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => ({
    getForElasticSearch: mockGetForElasticSearch,
    view: mockView,
    viewById: mockViewById,
    getInfoToEdit: mockGetInfoToEdit,
    create: mockCreate,
    update: mockUpdate,
    disownById: mockDisownById,
    deleteById: mockDeleteById
  }))
}));
let mockGetForElasticSearch = jest.fn().mockResolvedValue([[{id: 5432}]]);
let mockView = jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]]);
let mockViewById = jest.fn().mockResolvedValue([[{id: 5432}]]);
let mockGetInfoToEdit = jest.fn().mockResolvedValue([[{id: 5432}]]);
let mockCreate = jest.fn().mockResolvedValue({insertId: 5432});
let mockUpdate = jest.fn();
let mockDisownById = jest.fn();
let mockDeleteById = jest.fn();

jest.mock('../../../../src/mysql-access/RecipeEquipment', () => ({
  RecipeEquipment: jest.fn().mockImplementation(() => ({
    create: mockRECreate,
    update: mockREUpdate,
    deleteByRecipeId: mockREDeleteByRecipeId
  }))
}));
let mockRECreate = jest.fn();
let mockREUpdate = jest.fn();
let mockREDeleteByRecipeId = jest.fn();

jest.mock('../../../../src/mysql-access/RecipeIngredient', () => ({
  RecipeIngredient: jest.fn().mockImplementation(() => ({
    create: mockRICreate,
    update: mockRIUpdate,
    deleteByRecipeId: mockRIDeleteByRecipeId
  }))
}));
let mockRICreate = jest.fn();
let mockRIUpdate = jest.fn();
let mockRIDeleteByRecipeId = jest.fn();

jest.mock('../../../../src/mysql-access/RecipeMethod', () => ({
  RecipeMethod: jest.fn().mockImplementation(() => ({
    create: mockRMCreate,
    update: mockRMUpdate,
    deleteByRecipeId: mockRMDeleteByRecipeId
  }))
}));
let mockRMCreate = jest.fn();
let mockRMUpdate = jest.fn();
let mockRMDeleteByRecipeId = jest.fn();

jest.mock('../../../../src/mysql-access/RecipeSubrecipe', () => ({
  RecipeSubrecipe: jest.fn().mockImplementation(() => ({
    create: mockRSCreate,
    update: mockRSUpdate,
    deleteByRecipeId: mockRSDeleteByRecipeId,
    deleteBySubrecipeId: mockRSDeleteBySubrecipeId
  }))
}));
let mockRSCreate = jest.fn();
let mockRSUpdate = jest.fn();
let mockRSDeleteByRecipeId = jest.fn();
let mockRSDeleteBySubrecipeId = jest.fn();

jest.mock('../../../../src/mysql-access/FavoriteRecipe', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => ({
    deleteAllByRecipeId: mockFRDeleteAllByRecipeId
  }))
}));
let mockFRDeleteAllByRecipeId = jest.fn();

jest.mock('../../../../src/mysql-access/SavedRecipe', () => ({
  SavedRecipe: jest.fn().mockImplementation(() => ({
    deleteAllByRecipeId: mockSRDeleteAllByRecipeId
  }))
}));
let mockSRDeleteAllByRecipeId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff recipe controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {id: 15}};

  //getInfoToEdit?

  describe ('create method', () => {
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
          equipmentImage: "nobsc-recipe-equipment-default",
          ingredientsImage: "nobsc-recipe-ingredients-default",
          cookingImage: "nobsc-recipe-cooking-default",
          ownership: "public"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe created.'})};

    it('uses assert correctly', async () => {
      await staffRecipeController.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
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
      await staffRecipeController.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
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

    it('uses RecipeMethods.create correctly', async () => {
      await staffRecipeController.create(<Request>req, <Response>res);
      expect(mockRMCreate)
        .toHaveBeenCalledWith([5432, 2, 5432, 5], '(?, ?),(?, ?)');
    });

    it('uses RecipeEquipment.create correctly', async () => {
      await staffRecipeController.create(<Request>req, <Response>res);
      expect(mockRECreate)
        .toHaveBeenCalledWith([5432, 2, 1, 5432, 5, 3], '(?, ?, ?),(?, ?, ?)');
    });

    it('uses RecipeIngredients.create correctly', async () => {
      await staffRecipeController.create(<Request>req, <Response>res);
      expect(mockRICreate).toHaveBeenCalledWith(
        [5432, 2, 5, 4, 5432, 5, 2, 4],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
      );
    });

    it('uses RecipeSubrecipes.create correctly', async () => {
      await staffRecipeController.create(<Request>req, <Response>res);
      expect(mockRSCreate)
        .toHaveBeenCalledWith([5432, 48, 1, 1], '(?, ?, ?, ?)');
    });

    it('uses getForElasticSearch correctly', async () => {
      await staffRecipeController.create(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSearch.save correctly', async () => {
      await staffRecipeController.create(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: 5432});
    });

    it('sends data correctly', async () => {
      await staffRecipeController.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe created.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffRecipeController.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe created.'});
    });
  });

  describe ('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        recipeInfo: {
          id: 5432,
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
          equipmentImage: "nobsc-recipe-equipment-default",
          ingredientsImage: "nobsc-recipe-ingredients-default",
          cookingImage: "nobsc-recipe-cooking-default",
          ownership: "public"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe updated.'})};

    it('uses assert correctly', async () => {
      await staffRecipeController.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
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

    it ('uses update correctly', async () => {
      await staffRecipeController.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith({
        id: 5432,
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

    it('uses RecipeMethods.update correctly', async () => {
      await staffRecipeController.update(<Request>req, <Response>res);
      expect(mockRMUpdate)
        .toHaveBeenCalledWith([5432, 2, 5432, 5], '(?, ?),(?, ?)', 5432);
    });

    it('uses RecipeEquipment.update correctly', async () => {
      await staffRecipeController.update(<Request>req, <Response>res);
      expect(mockREUpdate).toHaveBeenCalledWith(
        [5432, 2, 1, 5432, 5, 3],
        '(?, ?, ?),(?, ?, ?)',
        5432
      );
    });

    it('uses RecipeIngredients.update correctly', async () => {
      await staffRecipeController.update(<Request>req, <Response>res);
      expect(mockRIUpdate).toHaveBeenCalledWith(
        [5432, 2, 5, 4, 5432, 5, 2, 4],
        '(?, ?, ?, ?),(?, ?, ?, ?)',
        5432
      );
    });

    it('uses RecipeSubrecipes.update correctly', async () => {
      await staffRecipeController.update(<Request>req, <Response>res);
      expect(mockRSUpdate)
        .toHaveBeenCalledWith([5432, 49, 1, 1], '(?, ?, ?, ?)', 5432);
    });

    it('uses getForElasticSearch correctly', async () => {
      await staffRecipeController.update(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSearch.save correctly', async () => {
      await staffRecipeController.update(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: 5432});
    });

    it('sends data correctly', async () => {
      await staffRecipeController.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe updated.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffRecipeController.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe updated.'});
    });
  });

  describe ('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe deleted.'})};

    it('uses FavoritedRecipe.deleteAllByRecipeId correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(mockFRDeleteAllByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses SavedRecipe.deleteAllByRecipeId correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(mockSRDeleteAllByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeEquipment.deleteByRecipeId correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(mockREDeleteByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeIngredients.deleteByRecipeId correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(mockRIDeleteByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeMethods.deleteByRecipeId correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(mockRMDeleteByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSubrecipes.deleteByRecipeId correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(mockRSDeleteByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSubrecipes.deleteBySubrecipeId correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(mockRSDeleteBySubrecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses deleteById correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(mockDeleteById).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSearch.delete correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(mockESDelete).toHaveBeenCalledWith(String(5432));
    });

    it('sends data correctly', async () => {
      await staffRecipeController.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe deleted.'});
    });

    it('returns correctly', async () => {
      const actual =
        await staffRecipeController.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe deleted.'});
    });
  });
});