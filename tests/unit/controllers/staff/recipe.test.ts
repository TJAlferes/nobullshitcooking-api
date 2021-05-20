import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { StaffRecipeController } from '../../../../src/controllers/staff';
import { validRecipe } from '../../../../src/lib/validations/entities';

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
    equipment: [{amount: 3, equipmentId: 1}, {amount: 6, equipmentId: 2}],
    ingredients: [
      {amount: 3, measurementId: 1, ingredientId: 1},
      {amount: 6, measurementId: 2, ingredientId: 2}
    ],
    subrecipes: [
      {amount: 3, measurementId: 1, subrecipeId: 1},
      {amount: 6, measurementId: 2, subrecipeId: 2}
    ]
  };
  const session = {...<Express.Session>{}, staffInfo: {id: 1}};

  describe('create method', () => {
    const message = 'Recipe created.';
    const req: Partial<Request> = {session, body: {recipeInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(recipeInfo, validRecipe);
    });

    it('uses create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(create).toHaveBeenCalledWith(recipeInfo);
    });

    it('uses RecipeMethods.create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(RMCreate).toHaveBeenCalledWith([1, 1, 1, 2], '(?, ?),(?, ?)');
    });

    it('uses RecipeEquipment.create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(RECreate)
        .toHaveBeenCalledWith([1, 1, 3, 1, 2, 6], '(?, ?, ?),(?, ?, ?)');
    });

    it('uses RecipeIngredients.create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(RICreate).toHaveBeenCalledWith(
        [1, 1, 3, 1, 1, 1, 6, 1],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
      );
    });

    it('uses RecipeSubrecipes.create', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(RICreate).toHaveBeenCalledWith(
        [1, 1, 3, 1, 1, 1, 6, 1],
        '(?, ?, ?, ?),(?, ?, ?, ?)'
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

  //describe('edit method', () => {});

  describe('update method', () => {
    const message = 'Recipe updated.';
    const req: Partial<Request> = {session, body: {recipeInfo: allRecipeInfo}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message})};

    it('uses assert', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(recipeInfo, validRecipe);
    });

    it ('uses update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(update).toHaveBeenCalledWith(recipeInfo);
    });

    it('uses RecipeMethods.update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(RMUpdate).toHaveBeenCalledWith(
        ["NOBSC Title", "Method 1", "NOBSC Title", "Method 2"],
        '(?, ?),(?, ?)',
        "NOBSC Title"
      );
    });

    it('uses RecipeEquipment.update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(REUpdate).toHaveBeenCalledWith(
        [
          "NOBSC Title", "NOBSC Equipment 1", 3,
          "NOBSC Title", "NOBSC Equipment 2", 6
        ],
        '(?, ?, ?),(?, ?, ?)',
        "NOBSC Title"
      );
    });

    it('uses RecipeIngredients.update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(RIUpdate).toHaveBeenCalledWith(
        [
          "NOBSC Title", "NOBSC Ingredient 1", 3, "teaspoon",
          "NOBSC Title", "NOBSC Ingredient 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?),(?, ?, ?, ?)',
        "NOBSC Title"
      );
    });

    it('uses RecipeSubrecipes.update', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(RSUpdate).toHaveBeenCalledWith(
        [
          "NOBSC Title", "NOBSC Recipe 1", 3, "teaspoon",
          "NOBSC Title", "NOBSC Recipe 2", 6, "Tablespoon"
        ],
        '(?, ?, ?, ?)',
        "NOBSC Title"
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