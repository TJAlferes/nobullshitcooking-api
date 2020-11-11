import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import {
  StaffRecipeController
} from '../../../../src/controllers/staff/recipe';
import {
  validRecipeEntity
} from '../../../../src/lib/validations/recipe/entity';

const esClient: Partial<Client> = {};
const pool: Partial<Pool> = {};
const controller = new StaffRecipeController(<Client>esClient, <Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/elasticsearch/RecipeSearch', () => ({
  RecipeSearch: jest.fn().mockImplementation(() => ({
    save: mockESSave,
    delete: mockESDelete
  }))
}));
let mockESSave = jest.fn();
let mockESDelete = jest.fn();

jest.mock('../../../../src/access/mysql/Recipe', () => ({
  Recipe: jest.fn().mockImplementation(() => ({
    getForElasticSearch: mockGetForElasticSearch,
    //view: mockView,
    //viewById: mockViewById,
    getInfoToEdit: mockGetInfoToEdit,
    create: mockCreate,
    update: mockUpdate,
    //disownById: mockDisownById,
    deleteById: mockDeleteById
  }))
}));
let mockGetForElasticSearch = jest.fn().mockResolvedValue([[{id: "NOBSC Title"}]]);
//let mockView = jest.fn().mockResolvedValue([[{id: "NOBSC Title 1"}, {id: "NOBSC Title 2"}]]);
//let mockViewById = jest.fn().mockResolvedValue([[{id: "NOBSC Title"}]]);
let mockGetInfoToEdit = jest.fn().mockResolvedValue([[{id: "NOBSC Title"}]]);
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
//let mockDisownById = jest.fn();
let mockDeleteById = jest.fn();

jest.mock('../../../../src/access/mysql/RecipeEquipment', () => ({
  RecipeEquipment: jest.fn().mockImplementation(() => ({
    create: mockRECreate,
    update: mockREUpdate,
    deleteByRecipeId: mockREDeleteByRecipeId
  }))
}));
let mockRECreate = jest.fn();
let mockREUpdate = jest.fn();
let mockREDeleteByRecipeId = jest.fn();

jest.mock('../../../../src/access/mysql/RecipeIngredient', () => ({
  RecipeIngredient: jest.fn().mockImplementation(() => ({
    create: mockRICreate,
    update: mockRIUpdate,
    deleteByRecipeId: mockRIDeleteByRecipeId
  }))
}));
let mockRICreate = jest.fn();
let mockRIUpdate = jest.fn();
let mockRIDeleteByRecipeId = jest.fn();

jest.mock('../../../../src/access/mysql/RecipeMethod', () => ({
  RecipeMethod: jest.fn().mockImplementation(() => ({
    create: mockRMCreate,
    update: mockRMUpdate,
    deleteByRecipeId: mockRMDeleteByRecipeId
  }))
}));
let mockRMCreate = jest.fn();
let mockRMUpdate = jest.fn();
let mockRMDeleteByRecipeId = jest.fn();

jest.mock('../../../../src/access/mysql/RecipeSubrecipe', () => ({
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

jest.mock('../../../../src/access/mysql/FavoriteRecipe', () => ({
  FavoriteRecipe: jest.fn().mockImplementation(() => ({
    deleteAllByRecipeId: mockFRDeleteAllByRecipeId
  }))
}));
let mockFRDeleteAllByRecipeId = jest.fn();

jest.mock('../../../../src/access/mysql/SavedRecipe', () => ({
  SavedRecipe: jest.fn().mockImplementation(() => ({
    deleteAllByRecipeId: mockSRDeleteAllByRecipeId
  }))
}));
let mockSRDeleteAllByRecipeId = jest.fn();

const createRecipeInfo = {
  type: "Type",
  cuisine: "Cuisine",
  author: "NOBSC",
  owner: "NOBSC",
  title: "Title",
  description: "Description.",
  activeTime: "00:00:30",
  totalTime: "00:07:00",
  directions: "Directions.",
  recipeImage: "nobsc-recipe-default",
  equipmentImage: "nobsc-recipe-equipment-default",
  ingredientsImage: "nobsc-recipe-ingredients-default",
  cookingImage: "nobsc-recipe-cooking-default",
  video: "video"
};
const bodyRecipeInfo = {
  ...createRecipeInfo,
  methods: [{method: "Method 1"}, {method: "Method 2"}],
  equipment: [
    {amount: 3, equipment: "NOBSC Equipment 1"},
    {amount: 6, equipment: "NOBSC Equipment 2"}
  ],
  ingredients: [
    {amount: 3, unit: "teaspoon", ingredient: "NOBSC Ingredient 1"},
    {amount: 6, unit: "Tablespoon", ingredient: "NOBSC Ingredient 2"}
  ],
  subrecipes: [
    {amount: 3, unit: "teaspoon", subrecipe: "NOBSC Recipe 1"},
    {amount: 6, unit: "Tablespoon", subrecipe: "NOBSC Recipe 2"}
  ]
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff recipe controller', () => {
  const session = {...<Express.Session>{}, staffInfo: {staffname: "Name"}};

  //getInfoToEdit?

  describe ('create method', () => {
    const req: Partial<Request> = {session, body: {recipeInfo: bodyRecipeInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe created.'})};

    it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(createRecipeInfo, validRecipeEntity);
    });

    it('uses createRecipe correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith(createRecipeInfo);
    });

    it('uses RecipeMethods.create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockRMCreate).toHaveBeenCalledWith(
        ["NOBSC Title", "Method 1", "NOBSC Title", "Method 2"],
        '(?, ?),(?, ?)'
      );
    });

    it('uses RecipeEquipment.create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockRECreate).toHaveBeenCalledWith(
        [
          "NOBSC Title", "NOBSC Equipment 1", 3,
          "NOBSC Title", "NOBSC Equipment 2", 6
        ],
        '(?, ?, ?),(?, ?, ?)'
      );
    });

    it('uses RecipeIngredients.create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockRICreate).toHaveBeenCalledWith(
        [
          "NOBSC Title", "NOBSC Ingredient 1", 3, "teaspoon",
          "NOBSC Title", "NOBSC Ingredient 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
      );
    });

    it('uses RecipeSubrecipes.create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockRSCreate).toHaveBeenCalledWith(
        [
          "NOBSC Title", "NOBSC Recipe 1", 3, "teaspoon",
          "NOBSC Title", "NOBSC Recipe 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
      );
    });

    it('uses getForElasticSearch correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses RecipeSearch.save correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: "NOBSC Title"});
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe created.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe created.'});
    });
  });

  describe ('update method', () => {
    const req: Partial<Request> = {session, body: {recipeInfo: bodyRecipeInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe updated.'})};

    it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(createRecipeInfo, validRecipeEntity);
    });

    it ('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdate).toHaveBeenCalledWith(createRecipeInfo);
    });

    it('uses RecipeMethods.update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockRMUpdate).toHaveBeenCalledWith(
        ["NOBSC Title", "Method 1", "NOBSC Title", "Method 2"],
        '(?, ?),(?, ?)',
        "NOBSC Title"
      );
    });

    it('uses RecipeEquipment.update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockREUpdate).toHaveBeenCalledWith(
        [
          "NOBSC Title", "NOBSC Equipment 1", 3,
          "NOBSC Title", "NOBSC Equipment 2", 6
        ],
        '(?, ?, ?),(?, ?, ?)',
        "NOBSC Title"
      );
    });

    it('uses RecipeIngredients.update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockRIUpdate).toHaveBeenCalledWith(
        [
          "NOBSC Title", "NOBSC Ingredient 1", 3, "teaspoon",
          "NOBSC Title", "NOBSC Ingredient 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?),(?, ?, ?, ?)',
        "NOBSC Title"
      );
    });

    it('uses RecipeSubrecipes.update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockRSUpdate).toHaveBeenCalledWith(
        [
          "NOBSC Title", "NOBSC Recipe 1", 3, "teaspoon",
          "NOBSC Title", "NOBSC Recipe 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?)',
        "NOBSC Title"
      );
    });

    it('uses getForElasticSearch correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses RecipeSearch.save correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: "NOBSC Title"});
    });

    it('sends data correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe updated.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe updated.'});
    });
  });

  describe ('delete method', () => {
    const req: Partial<Request> = {session, body: {id: "NOBSC Title"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe deleted.'})};

    it('uses FavoritedRecipe.deleteAllByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockFRDeleteAllByRecipeId).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses SavedRecipe.deleteAllByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockSRDeleteAllByRecipeId).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses RecipeEquipment.deleteByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockREDeleteByRecipeId).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses RecipeIngredients.deleteByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockRIDeleteByRecipeId).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses RecipeMethods.deleteByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockRMDeleteByRecipeId).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses RecipeSubrecipes.deleteByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockRSDeleteByRecipeId).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses RecipeSubrecipes.deleteBySubrecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockRSDeleteBySubrecipeId).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses deleteById correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteById).toHaveBeenCalledWith("NOBSC Title");
    });

    it('uses RecipeSearch.delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockESDelete).toHaveBeenCalledWith(String("NOBSC Title"));
    });

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe deleted.'});
    });
  });
});