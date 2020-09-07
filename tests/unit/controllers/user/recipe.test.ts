import { Request, Response } from 'express';
import { assert, coerce } from 'superstruct';

import { userRecipeController } from '../../../../src/controllers/user/recipe';
import {
  validRecipeEntity
} from '../../../../src/lib/validations/recipe/entity';

jest.mock('superstruct');

jest.mock('../../../../src/lib/connections/elasticsearchClient');

jest.mock('../../../../src/lib/connections/mysqlPoolConnection');

jest.mock('../../../../src/elasticsearch-access/RecipeSearch', () => ({
  RecipeSearch: jest.fn().mockImplementation(() => ({save: mockESSave}))
}));
let mockESSave = jest.fn();

jest.mock('../../../../src/mysql-access/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => ({
    getForElasticSearch: mockGetForElasticSearch,
    view: mockView,
    viewById: mockViewById,
    getInfoToEdit: mockGetInfoToEdit,
    create: mockCreate,
    updatePrivate: mockUpdatePrivate,
    disownById: mockDisownById,
    deletePrivateById: mockDeletePrivateById
  }))
}));
let mockGetForElasticSearch = jest.fn().mockResolvedValue([[{id: 5432}]]);
let mockView = jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]]);
let mockViewById = jest.fn().mockResolvedValue([[{id: 5432}]]);
let mockGetInfoToEdit = jest.fn().mockResolvedValue([[{id: 5432}]]);
let mockCreate = jest.fn().mockResolvedValue({insertId: 5432});
let mockUpdatePrivate = jest.fn();
let mockDisownById = jest.fn();
let mockDeletePrivateById = jest.fn();

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

afterEach(() => {
  jest.clearAllMocks();
});

describe('user recipe controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 150}};

  describe('viewPrivate method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]])};

    it('uses view correctly', async () => {
      await userRecipeController.viewPrivate(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith(150, 150);
    });

    it('sends data correctly', async () => {
      await userRecipeController.viewPrivate(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([[{id: 383}, {id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual =
        await userRecipeController.viewPrivate(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: 383}, {id: 5432}]]);
    });
  });

  describe('viewPublic method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]])};

    it('uses view correctly', async () => {
      await userRecipeController.viewPublic(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith(150, 1);
    });

    it('sends data correctly', async () => {
      await userRecipeController.viewPublic(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([[{id: 383}, {id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual =
        await userRecipeController.viewPublic(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: 383}, {id: 5432}]]);
    });
  });

  describe('viewPrivateById method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: 5432}])};

    it('uses viewById correctly', async () => {
      await userRecipeController.viewPrivateById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data correctly', async () => {
      await userRecipeController.viewPrivateById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
        .viewPrivateById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: 5432}]);
    });
  });

  describe('viewPublicById method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: 5432}])};

    it('uses viewById correctly', async () => {
      await userRecipeController
        .viewPublicById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(5432, 150, 1);
    });

    it('sends data correctly', async () => {
      await userRecipeController
        .viewPublicById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
        .viewPublicById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: 5432}]);
    });
  });

  describe('getInfoToEditPrivate method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: 5432}])};

    it('uses getInfoToEditMyUserRecipe correctly', async () => {
      await userRecipeController
        .getInfoToEditPrivate(<Request>req, <Response>res);
      expect(mockGetInfoToEdit).toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data correctly', async () => {
      await userRecipeController
        .getInfoToEditPrivate(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
        .getInfoToEditPrivate(<Request>req, <Response>res);
      expect(actual).toEqual([{id: 5432}]);
    });
  });

  describe('getInfoToEditPublic method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: 5432}])};

    it('uses getInfoToEditMyUserRecipe correctly', async () => {
      await userRecipeController
        .getInfoToEditPublic(<Request>req, <Response>res);
      expect(mockGetInfoToEdit).toHaveBeenCalledWith(5432, 150, 1);
    });

    it('sends data correctly', async () => {
      await userRecipeController
        .getInfoToEditPublic(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
        .getInfoToEditPublic(<Request>req, <Response>res);
      expect(actual).toEqual([{id: 5432}]);
    });
  });

  describe ('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        recipeInfo: {
          recipeTypeId: 2,
          cuisineId: 2,
          title: "My Recipe",
          description: "Tasty.",
          activeTime: "00:30:00",
          totalTime: "04:00:00",
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

    // TO DO: finish, coerce?
    /*it('uses assert correctly', async () => {
      await userRecipeController.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          recipeTypeId: 2,
          cuisineId: 2,
          authorId: 150,
          ownerId: 1,
          title: "My Recipe",
          description: "Tasty.",
          activeTime: "00:30:00",
          totalTime: "04:00:00",
          directions: "Do this, then that.",
          recipeImage: "nobsc-recipe-default",
          equipmentImage: "nobsc-recipe-equipment-default",
          ingredientsImage: "nobsc-recipe-ingredients-default",
          cookingImage: "nobsc-recipe-cooking-default"
        },
        validRecipeEntity
      );
    });*/

    it('uses createRecipe correctly', async () => {
      await userRecipeController.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith({
        recipeTypeId: 2,
        cuisineId: 2,
        authorId: 150,
        ownerId: 1,
        title: "My Recipe",
        description: "Tasty.",
        activeTime: "00:30:00",
        totalTime: "04:00:00",
        directions: "Do this, then that.",
        recipeImage: "nobsc-recipe-default",
        equipmentImage: "nobsc-recipe-equipment-default",
        ingredientsImage: "nobsc-recipe-ingredients-default",
        cookingImage: "nobsc-recipe-cooking-default"
      });
    });

    it('uses RecipeMethods.create correctly', async () => {
      await userRecipeController.create(<Request>req, <Response>res);
      expect(mockRMCreate)
        .toHaveBeenCalledWith([5432, 2, 5432, 5], '(?, ?),(?, ?)');
    });

    it('uses RecipeEquipment.create correctly', async () => {
      await userRecipeController.create(<Request>req, <Response>res);
      expect(mockRECreate)
        .toHaveBeenCalledWith([5432, 2, 1, 5432, 5, 3], '(?, ?, ?),(?, ?, ?)');
    });

    it('uses RecipeIngredients.create correctly', async () => {
      await userRecipeController.create(<Request>req, <Response>res);
      expect(mockRICreate).toHaveBeenCalledWith(
        [5432, 2, 5, 4, 5432, 5, 2, 4],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
      );
    });

    it('uses RecipeSubrecipes.create correctly', async () => {
      await userRecipeController.create(<Request>req, <Response>res);
      expect(mockRSCreate)
        .toHaveBeenCalledWith([5432, 48, 1, 1], '(?, ?, ?, ?)');
    });

    it('uses getForElasticSearch correctly', async () => {
      await userRecipeController.create(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSearch.save correctly', async () => {
      await userRecipeController.create(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: 5432});
    });

    it('sends data correctly', async () => {
      await userRecipeController.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe created.'});
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
        .create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe created.'});
    });
  });

  describe ('updateMyUserRecipe method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        recipeInfo: {
          id: 5432,
          recipeTypeId: 2,
          cuisineId: 2,
          title: "My Recipe",
          description: "Tasty.",
          activeTime: "00:30:00",
          totalTime: "04:00:00",
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
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe updated.'})
    };

    // TO DO: finish, coerce?
    /*it('uses assert correctly', async () => {
      await userRecipeController.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          recipeTypeId: 2,
          cuisineId: 2,
          authorId: 150,
          ownerId: 1,
          title: "My Recipe",
          description: "Tasty.",
          activeTime: "00:30:00",
          totalTime: "04:00:00",
          directions: "Do this, then that.",
          recipeImage: "nobsc-recipe-default",
          equipmentImage: "nobsc-recipe-equipment-default",
          ingredientsImage: "nobsc-recipe-ingredients-default",
          cookingImage: "nobsc-recipe-cooking-default"
        },
        validRecipeEntity
      );
    });*/

    it ('uses update correctly', async () => {
      await userRecipeController.update(<Request>req, <Response>res);
      expect(mockUpdatePrivate).toHaveBeenCalledWith({
        id: 5432,
        recipeTypeId: 2,
        cuisineId: 2,
        authorId: 150,
        ownerId: 1,
        title: "My Recipe",
        description: "Tasty.",
        activeTime: "00:30:00",
        totalTime: "04:00:00",
        directions: "Do this, then that.",
        recipeImage: "nobsc-recipe-default",
        equipmentImage: "nobsc-recipe-equipment-default",
        ingredientsImage: "nobsc-recipe-ingredients-default",
        cookingImage: "nobsc-recipe-cooking-default"
      });
    });

    it('uses RecipeMethods.update correctly', async () => {
      await userRecipeController.update(<Request>req, <Response>res);
      expect(mockRMUpdate)
        .toHaveBeenCalledWith([5432, 2, 5432, 5], '(?, ?),(?, ?)', 5432);
    });

    it('uses RecipeEquipment.update correctly', async () => {
      await userRecipeController.update(<Request>req, <Response>res);
      expect(mockREUpdate).toHaveBeenCalledWith(
        [5432, 2, 1, 5432, 5, 3],
        '(?, ?, ?),(?, ?, ?)',
        5432
      );
    });

    it('uses RecipeIngredients.update correctly', async () => {
      await userRecipeController.update(<Request>req, <Response>res);
      expect(mockRIUpdate).toHaveBeenCalledWith(
        [5432, 2, 5, 4, 5432, 5, 2, 4],
        '(?, ?, ?, ?),(?, ?, ?, ?)',
        5432
      );
    });

    it('uses RecipeSubrecipes.update correctly', async () => {
      await userRecipeController.update(<Request>req, <Response>res);
      expect(mockRSUpdate)
        .toHaveBeenCalledWith([5432, 49, 1, 1], '(?, ?, ?, ?)', 5432);
    });

    it('uses getForElasticSearch correctly', async () => {
      await userRecipeController.update(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSearch.save correctly', async () => {
      await userRecipeController.update(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: 5432});
    });

    it('sends data correctly', async () => {
      await userRecipeController.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe updated.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userRecipeController.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe updated.'});
    });
  });

  describe ('deletePrivateById method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe deleted.'})};

    it('uses RecipeEquipment.deleteByRecipeId correctly', async () => {
      await userRecipeController.deletePrivateById(<Request>req, <Response>res);
      expect(mockREDeleteByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeIngredients.deleteByRecipeId correctly', async () => {
      await userRecipeController.deletePrivateById(<Request>req, <Response>res);
      expect(mockRIDeleteByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeMethods.deleteByRecipeId correctly', async () => {
      await userRecipeController.deletePrivateById(<Request>req, <Response>res);
      expect(mockRMDeleteByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSubrecipes.deleteByRecipeId correctly', async () => {
      await userRecipeController.deletePrivateById(<Request>req, <Response>res);
      expect(mockRSDeleteByRecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSubrecipes.deleteBySubrecipeId correctly', async () => {
      await userRecipeController.deletePrivateById(<Request>req, <Response>res);
      expect(mockRSDeleteBySubrecipeId).toHaveBeenCalledWith(5432);
    });

    it('uses deletePrivateById correctly', async () => {
      await userRecipeController.deletePrivateById(<Request>req, <Response>res);
      expect(mockDeletePrivateById).toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data correctly', async () => {
      await userRecipeController.deletePrivateById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await userRecipeController
        .deletePrivateById(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe deleted.'});
    });
  });

  describe ('disownById method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe disowned.'})};

    it('uses disownById correctly', async () => {
      await userRecipeController.disownById(<Request>req, <Response>res);
      expect(mockDisownById).toHaveBeenCalledWith(5432, 150);
    });

    it('uses getForElasticSearch correctly', async () => {
      await userRecipeController.disownById(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith(5432);
    });

    it('uses RecipeSearch.save correctly', async () => {
      await userRecipeController.disownById(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: 5432});
    });

    it('sends data correctly', async () => {
      await userRecipeController.disownById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe disowned.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userRecipeController.disownById(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe disowned.'});
    });
  });
});