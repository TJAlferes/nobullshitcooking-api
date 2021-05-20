import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { StaffRecipeController } from '../../../../src/controllers/staff';
import {
  validRecipe,
  validRecipeEquipment,
  validRecipeIngredient,
  validRecipeMethod,
  validRecipeSubrecipe
} from '../../../../src/lib/validations/entities';

const esClient: Partial<Client> = {};
const pool: Partial<Pool> = {};
const controller = new StaffRecipeController(<Client>esClient, <Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/elasticsearch', () => ({
  RecipeSearch: jest.fn().mockImplementation(() => ({
    save: ESSave, delete: ESDelete
  }))
}));
let ESSave = jest.fn();
let ESDelete = jest.fn();

const row = [{id: 1}];
const toSave = {
  id: "1",
  author: "Author",
  recipe_type_name: "Name",
  cuisine_name: "Name",
  title: "Title",
  description: "Description.",
  directions: "Directions.",
  recipe_image: "image",
  method_names: ["Name", "Name"],
  equipment_names: ["Name", "Name"],
  ingredient_names: ["Name", "Name"],
  subrecipe_titles: ["Title", "Title"]
};
jest.mock('../../../../src/access/mysql', () => ({
  Recipe: jest.fn().mockImplementation(() => ({
    getForElasticSearch, create, edit, update, deleteById
  })),
  RecipeEquipment: jest.fn().mockImplementation(() => ({
    create: RECreate, update: REUpdate, deleteByRecipeId: REDeleteByRecipeId
  })),
  RecipeIngredient: jest.fn().mockImplementation(() => ({
    create: RICreate, update: RIUpdate, deleteByRecipeId: RIDeleteByRecipeId
  })),
  RecipeMethod: jest.fn().mockImplementation(() => ({
    create: RMCreate, update: RMUpdate, deleteByRecipeId: RMDeleteByRecipeId
  })),
  RecipeSubrecipe: jest.fn().mockImplementation(() => ({
    create: RSCreate,
    update: RSUpdate,
    deleteByRecipeId: RSDeleteByRecipeId,
    deleteBySubrecipeId: RSDeleteBySubrecipeId
  })),
  FavoriteRecipe: jest.fn().mockImplementation(() => ({
    deleteAllByRecipeId: FRDeleteAllByRecipeId
  })),
  SavedRecipe: jest.fn().mockImplementation(() => ({
    deleteAllByRecipeId: SRDeleteAllByRecipeId
  }))
}));
let getForElasticSearch = jest.fn().mockResolvedValue(toSave);
let create = jest.fn().mockResolvedValue({insertId: 1});
let edit = jest.fn().mockResolvedValue([row]);
let update = jest.fn();
let deleteById = jest.fn();
let RECreate = jest.fn();
let REUpdate = jest.fn();
let REDeleteByRecipeId = jest.fn();
let RICreate = jest.fn();
let RIUpdate = jest.fn();
let RIDeleteByRecipeId = jest.fn();
let RMCreate = jest.fn();
let RMUpdate = jest.fn();
let RMDeleteByRecipeId = jest.fn();
let RSCreate = jest.fn();
let RSUpdate = jest.fn();
let RSDeleteByRecipeId = jest.fn();
let RSDeleteBySubrecipeId = jest.fn();
let FRDeleteAllByRecipeId = jest.fn();
let SRDeleteAllByRecipeId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('staff recipe controller', () => {
  const recipeInfo = {
    recipeTypeId: 1,
    cuisineId: 1,
    authorId: 1,
    ownerId: 1,
    title: "Title",
    description: "Description.",
    activeTime: "00:00:30",
    totalTime: "00:07:00",
    directions: "Directions.",
    recipeImage: "image",
    equipmentImage: "image",
    ingredientsImage: "image",
    cookingImage: "image",
    video: "video"
  };
  const allRecipeInfo = {
    ...recipeInfo,
    methods: [{methodId: 1}, {methodId: 2}],
    equipment: [{amount: 1, equipmentId: 1}, {amount: 2, equipmentId: 2}],
    ingredients: [
      {amount: 1, measurementId: 1, ingredientId: 1},
      {amount: 2, measurementId: 2, ingredientId: 2}
    ],
    subrecipes: [
      {amount: 1, measurementId: 1, subrecipeId: 1},
      {amount: 2, measurementId: 2, subrecipeId: 2}
    ]
  };
  // move into separate service unit test file?
  const assertMethods =
    [{recipeId: 1, methodId: 1}, {recipeId: 1, methodId: 2}];
  const assertEquipment = [
    {recipeId: 1, amount: 1, equipmentId: 1},
    {recipeId: 1, amount: 2, equipmentId: 2}
  ];
  const assertIngredients = [
    {recipeId: 1, amount: 1, measurementId: 1, ingredientId: 1},
    {recipeId: 1, amount: 2, measurementId: 2, ingredientId: 2}
  ];
  const assertSubrecipes = [
    {recipeId: 1, amount: 1, measurementId: 1, subrecipeId: 1},
    {recipeId: 1, amount: 2, measurementId: 2, subrecipeId: 2}
  ];
  const session = {...<Express.Session>{}, staffInfo: {id: 1}};

  describe('create method', () => {
    const message = 'Recipe created.';
    const req: Partial<Request> = {session, body: {recipeInfo: allRecipeInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert on recipe', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(recipeInfo, validRecipe);
    });

    it('uses create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(create).toHaveBeenCalledWith(recipeInfo);
    });

    it('uses assert on recipe methods', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(assertMethods[0], validRecipeMethod);
      expect(assert).toHaveBeenCalledWith(assertMethods[1], validRecipeMethod);
    });

    it('uses RecipeMethods.create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(RMCreate).toHaveBeenCalledWith('(?, ?),(?, ?)', [1, 1, 1, 2]);
    });

    it('uses assert on recipe equipment', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith(assertEquipment[0], validRecipeEquipment);
      expect(assert)
        .toHaveBeenCalledWith(assertEquipment[1], validRecipeEquipment);
    });

    it('uses RecipeEquipment.create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(RECreate)
        .toHaveBeenCalledWith('(?, ?, ?),(?, ?, ?)', [1, 1, 1, 1, 2, 2]);
    });

    it('uses assert on recipe ingredients', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith(assertIngredients[0], validRecipeIngredient);
      expect(assert)
        .toHaveBeenCalledWith(assertIngredients[1], validRecipeIngredient);
    });

    it('uses RecipeIngredients.create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(RICreate).toHaveBeenCalledWith(
        '(?, ?, ?, ?),(?, ?, ?, ?)', [1, 1, 1, 1, 1, 2, 2, 2]
      );
    });

    it('uses assert on recipe subrecipes', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith(assertSubrecipes[0], validRecipeSubrecipe);
      expect(assert)
        .toHaveBeenCalledWith(assertSubrecipes[1], validRecipeSubrecipe);
    });

    it('uses RecipeSubrecipes.create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(RICreate).toHaveBeenCalledWith(
        '(?, ?, ?, ?),(?, ?, ?, ?)', [1, 1, 1, 1, 1, 2, 2, 2]
      );
    });

    it('uses getForElasticSearch', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(getForElasticSearch).toHaveBeenCalledWith(1);
    });

    it('uses RecipeSearch.save', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(ESSave).toHaveBeenCalledWith(toSave);
    });

    it('returns sent data', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('edit method', () => {
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(row)};

    it('uses edit', async () => {
      await controller.edit(<Request>req, <Response>res);
      expect(edit).toHaveBeenCalledWith(1, 1, 1);
    });

    it('returns sent data', async () => {
      const actual = await controller.edit(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(row);
      expect(actual).toEqual(row);
    });
  });

  describe('update method', () => {
    const message = 'Recipe updated.';
    const req: Partial<Request> =
      {session, body: {recipeInfo: {id: "1", ...allRecipeInfo}}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert on recipe', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(recipeInfo, validRecipe);
    });

    it ('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(update).toHaveBeenCalledWith({id: 1, recipeInfo}, 1, 1);
    });

    it('uses assert on recipe methods', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(assertMethods[0], validRecipeMethod);
      expect(assert).toHaveBeenCalledWith(assertMethods[1], validRecipeMethod);
    });

    it('uses RecipeMethods.create', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(RMCreate).toHaveBeenCalledWith('(?, ?),(?, ?)', [1, 1, 1, 2]);
    });

    it('uses assert on recipe equipment', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith(assertEquipment[0], validRecipeEquipment);
      expect(assert)
        .toHaveBeenCalledWith(assertEquipment[1], validRecipeEquipment);
    });

    it('uses RecipeEquipment.create', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(RECreate)
        .toHaveBeenCalledWith('(?, ?, ?),(?, ?, ?)', [1, 1, 1, 1, 2, 2]);
    });

    it('uses assert on recipe ingredients', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith(assertIngredients[0], validRecipeIngredient);
      expect(assert)
        .toHaveBeenCalledWith(assertIngredients[1], validRecipeIngredient);
    });

    it('uses RecipeIngredients.create', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(RICreate).toHaveBeenCalledWith(
        '(?, ?, ?, ?),(?, ?, ?, ?)', [1, 1, 1, 1, 1, 2, 2, 2]
      );
    });

    it('uses assert on recipe subrecipes', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert)
        .toHaveBeenCalledWith(assertSubrecipes[0], validRecipeSubrecipe);
      expect(assert)
        .toHaveBeenCalledWith(assertSubrecipes[1], validRecipeSubrecipe);
    });

    it('uses RecipeSubrecipes.create', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(RICreate).toHaveBeenCalledWith(
        '(?, ?, ?, ?),(?, ?, ?, ?)', [1, 1, 1, 1, 1, 2, 2, 2]
      );
    });

    it('uses getForElasticSearch', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(getForElasticSearch).toHaveBeenCalledWith(1);
    });

    it('uses RecipeSearch.save', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(ESSave).toHaveBeenCalledWith(toSave);
    });

    it('returns sent data', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });

  describe('delete method', () => {
    const message = 'Recipe deleted.';
    const req: Partial<Request> = {session, body: {id: "1"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses RecipeSearch.delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(ESDelete).toHaveBeenCalledWith(String(1));
    });

    it('uses FavoritedRecipe.deleteAllByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(FRDeleteAllByRecipeId).toHaveBeenCalledWith(1);
    });

    it('uses SavedRecipe.deleteAllByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(SRDeleteAllByRecipeId).toHaveBeenCalledWith(1);
    });

    it('uses RecipeEquipment.deleteByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(REDeleteByRecipeId).toHaveBeenCalledWith(1);
    });

    it('uses RecipeIngredients.deleteByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(RIDeleteByRecipeId).toHaveBeenCalledWith(1);
    });

    it('uses RecipeMethods.deleteByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(RMDeleteByRecipeId).toHaveBeenCalledWith(1);
    });

    it('uses RecipeSubrecipes.deleteByRecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(RSDeleteByRecipeId).toHaveBeenCalledWith(1);
    });

    it('uses RecipeSubrecipes.deleteBySubrecipeId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(RSDeleteBySubrecipeId).toHaveBeenCalledWith(1);
    });

    it('uses deleteById', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(deleteById).toHaveBeenCalledWith(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message});
      expect(actual).toEqual({message});
    });
  });
});