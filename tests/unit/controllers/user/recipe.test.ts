import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert, coerce } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { UserRecipeController } from '../../../../src/controllers/user/recipe';
import {
  validRecipeEntity
} from '../../../../src/lib/validations/recipe/entity';

const esClient: Partial<Client> = {};
const pool: Partial<Pool> = {};
const controller = new UserRecipeController(<Client>esClient, <Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/lib/connections/elasticsearch');  // ?

jest.mock('../../../../src/lib/connections/mysql');  // ?

jest.mock('../../../../src/access/elasticsearch/RecipeSearch', () => ({
  RecipeSearch: jest.fn().mockImplementation(() => ({save: mockESSave}))
}));
let mockESSave = jest.fn();

jest.mock('../../../../src/access/mysql/Recipe', () => ({
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
let mockGetForElasticSearch = jest.fn().mockResolvedValue([[{id: "Name Title 2"}]]);
let mockView = jest.fn().mockResolvedValue([[{id: "Name Title 1"}, {id: "Name Title 2"}]]);
let mockViewById = jest.fn().mockResolvedValue([[{id: "Name Title 2"}]]);
let mockGetInfoToEdit = jest.fn().mockResolvedValue([[{id: "Name Title 2"}]]);
let mockCreate = jest.fn().mockResolvedValue({insertId: "Name Title 2"});
let mockUpdatePrivate = jest.fn();
let mockDisownById = jest.fn();
let mockDeletePrivateById = jest.fn();

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

const createRecipeInfo = {
  type: "Type",
  cuisine: "Cuisine",
  author: "Name",
  owner: "Name",
  title: "Title 2",
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

describe('user recipe controller', () => {
  const session = {...<Express.Session>{}, userInfo: {username: "Name"}};

  describe('viewPrivate method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{id: "Name Title 1"}, {id: "Name Title 2"}]]
      )
    };

    it('uses view correctly', async () => {
      await controller.viewPrivate(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith("Name", "Name");
    });

    it('sends data correctly', async () => {
      await controller.viewPrivate(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith([[{id: "Name Title 1"}, {id: "Name Title 2"}]]);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewPrivate(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: "Name Title 1"}, {id: "Name Title 2"}]]);
    });
  });

  describe('viewPublic method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{id: "Name Title 1"}, {id: "Name Title 2"}]]
      )
    };

    it('uses view correctly', async () => {
      await controller.viewPublic(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith("Name", "NOBSC");
    });

    it('sends data correctly', async () => {
      await controller.viewPublic(<Request>req, <Response>res);
      expect(res.send)
        .toHaveBeenCalledWith([[{id: "Name Title 1"}, {id: "Name Title 2"}]]);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewPublic(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: "Name Title 1"}, {id: "Name Title 2"}]]);
    });
  });

  describe('viewPrivateById method', () => {
    const req: Partial<Request> = {session, body: {id: "Name Title 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: "Name Title 2"}])};

    it('uses viewById correctly', async () => {
      await controller.viewPrivateById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith("Name Title 2", "Name", "Name");
    });

    it('sends data correctly', async () => {
      await controller.viewPrivateById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: "Name Title 2"}]);
    });

    it('returns correctly', async () => {
      const actual = await controller
        .viewPrivateById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: "Name Title 2"}]);
    });
  });

  describe('viewPublicById method', () => {
    const req: Partial<Request> = {session, body: {id: "Name Title 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: "Name Title 2"}])};

    it('uses viewById correctly', async () => {
      await controller.viewPublicById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith("Name Title 2", "Name", 1);
    });

    it('sends data correctly', async () => {
      await controller.viewPublicById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: "Name Title 2"}]);
    });

    it('returns correctly', async () => {
      const actual = await controller
        .viewPublicById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: "Name Title 2"}]);
    });
  });

  describe('getInfoToEditPrivate method', () => {
    const req: Partial<Request> = {session, body: {id: "Name Title 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: "Name Title 2"}])};

    it('uses getInfoToEditMyUserRecipe correctly', async () => {
      await controller
        .getInfoToEditPrivate(<Request>req, <Response>res);
      expect(mockGetInfoToEdit).toHaveBeenCalledWith("Name Title 2", "Name", "Name");
    });

    it('sends data correctly', async () => {
      await controller.getInfoToEditPrivate(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: "Name Title 2"}]);
    });

    it('returns correctly', async () => {
      const actual = await controller
        .getInfoToEditPrivate(<Request>req, <Response>res);
      expect(actual).toEqual([{id: "Name Title 2"}]);
    });
  });

  describe('getInfoToEditPublic method', () => {
    const req: Partial<Request> = {session, body: {id: "Name Title 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: "Name Title 2"}])};

    it('uses getInfoToEditMyUserRecipe correctly', async () => {
      await controller.getInfoToEditPublic(<Request>req, <Response>res);
      expect(mockGetInfoToEdit)
        .toHaveBeenCalledWith("Name Title 2", "Name", "NOBSC");
    });

    it('sends data correctly', async () => {
      await controller.getInfoToEditPublic(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: "Name Title 2"}]);
    });

    it('returns correctly', async () => {
      const actual = await controller
        .getInfoToEditPublic(<Request>req, <Response>res);
      expect(actual).toEqual([{id: "Name Title 2"}]);
    });
  });

  describe ('create method', () => {
    const req: Partial<Request> = {session, body: {recipeInfo: bodyRecipeInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe created.'})};

    // TO DO: finish, coerce?
    /*it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(createRecipeInfo, validRecipeEntity);
    });*/

    it('uses createRecipe correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreate).toHaveBeenCalledWith(createRecipeInfo);
    });

    it('uses RecipeMethods.create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockRMCreate).toHaveBeenCalledWith(
        ["Name Title 2", "Method 1", "Name Title 2", "Method 2"],
        '(?, ?),(?, ?)'
      );
    });

    it('uses RecipeEquipment.create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockRECreate).toHaveBeenCalledWith(
        [
          "Name Title 2", "NOBSC Equipment 1", 3,
          "Name Title 2", "NOBSC Equipment 2", 6
        ],
        '(?, ?, ?),(?, ?, ?)'
      );
    });

    it('uses RecipeIngredients.create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockRICreate).toHaveBeenCalledWith(
        [
          "Name Title 2", "NOBSC Ingredient 1", 3, "teaspoon",
          "Name Title 2", "NOBSC Ingredient 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
      );
    });

    it('uses RecipeSubrecipes.create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockRSCreate).toHaveBeenCalledWith(
        [
          "Name Title 2", "NOBSC Recipe 1", 3, "teaspoon",
          "Name Title 2", "NOBSC Recipe 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
      );
    });

    it('uses getForElasticSearch correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith("Name Title 2");
    });

    it('uses RecipeSearch.save correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: "Name Title 2"});
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

  describe ('updateMyUserRecipe method', () => {
    const req: Partial<Request> = {session, body: {recipeInfo: bodyRecipeInfo}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Recipe updated.'})
    };

    // TO DO: finish, coerce?
    /*it('uses assert correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(createRecipeInfo, validRecipeEntity);
    });*/

    it ('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdatePrivate).toHaveBeenCalledWith(createRecipeInfo);
    });

    it('uses RecipeMethods.update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockRMUpdate).toHaveBeenCalledWith(
        ["Name Title 2", "Method 1", "Name Title 2", "Method 2"],
        '(?, ?),(?, ?)',
        "Name Title 2"
      );
    });

    it('uses RecipeEquipment.update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockREUpdate).toHaveBeenCalledWith(
        [
          "Name Title 2", "NOBSC Equipment 1", 3,
          "Name Title 2", "NOBSC Equipment 2", 6
        ],
        '(?, ?, ?),(?, ?, ?)',
        "Name Title 2"
      );
    });

    it('uses RecipeIngredients.update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockRIUpdate).toHaveBeenCalledWith(
        [
          "Name Title 2", "NOBSC Ingredient 1", 3, "teaspoon",
          "Name Title 2", "NOBSC Ingredient 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?),(?, ?, ?, ?)',
        "Name Title 2"
      );
    });

    it('uses RecipeSubrecipes.update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockRSUpdate).toHaveBeenCalledWith(
        [
          "Name Title 2", "NOBSC Recipe 1", 3, "teaspoon",
          "Name Title 2", "NOBSC Recipe 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?)',
        "Name Title 2"
      );
    });

    it('uses getForElasticSearch correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith("Name Title 2");
    });

    it('uses RecipeSearch.save correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: "Name Title 2"});
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

  describe ('deletePrivateById method', () => {
    const req: Partial<Request> = {session, body: {id: "Name Title 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe deleted.'})};

    it('uses RecipeEquipment.deleteByRecipeId correctly', async () => {
      await controller.deletePrivateById(<Request>req, <Response>res);
      expect(mockREDeleteByRecipeId).toHaveBeenCalledWith("Name Title 2");
    });

    it('uses RecipeIngredients.deleteByRecipeId correctly', async () => {
      await controller.deletePrivateById(<Request>req, <Response>res);
      expect(mockRIDeleteByRecipeId).toHaveBeenCalledWith("Name Title 2");
    });

    it('uses RecipeMethods.deleteByRecipeId correctly', async () => {
      await controller.deletePrivateById(<Request>req, <Response>res);
      expect(mockRMDeleteByRecipeId).toHaveBeenCalledWith("Name Title 2");
    });

    it('uses RecipeSubrecipes.deleteByRecipeId correctly', async () => {
      await controller.deletePrivateById(<Request>req, <Response>res);
      expect(mockRSDeleteByRecipeId).toHaveBeenCalledWith("Name Title 2");
    });

    it('uses RecipeSubrecipes.deleteBySubrecipeId correctly', async () => {
      await controller.deletePrivateById(<Request>req, <Response>res);
      expect(mockRSDeleteBySubrecipeId).toHaveBeenCalledWith("Name Title 2");
    });

    it('uses deletePrivateById correctly', async () => {
      await controller.deletePrivateById(<Request>req, <Response>res);
      expect(mockDeletePrivateById)
        .toHaveBeenCalledWith("Name Title 2", "Name", "Name");
    });

    it('sends data correctly', async () => {
      await controller.deletePrivateById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller
        .deletePrivateById(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe deleted.'});
    });
  });

  describe ('disownById method', () => {
    const req: Partial<Request> = {session, body: {id: "Name Title 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Recipe disowned.'})};

    it('uses disownById correctly', async () => {
      await controller.disownById(<Request>req, <Response>res);
      expect(mockDisownById).toHaveBeenCalledWith("Name Title 2", "Name");
    });

    it('uses getForElasticSearch correctly', async () => {
      await controller.disownById(<Request>req, <Response>res);
      expect(mockGetForElasticSearch).toHaveBeenCalledWith("Name Title 2");
    });

    it('uses RecipeSearch.save correctly', async () => {
      await controller.disownById(<Request>req, <Response>res);
      expect(mockESSave).toHaveBeenCalledWith({id: "Name Title 2"});
    });

    it('sends data correctly', async () => {
      await controller.disownById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Recipe disowned.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.disownById(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Recipe disowned.'});
    });
  });
});