import { Request, Response } from 'express';

import { searchController } from './search';

const found = {some: "value"};

jest.mock('../elasticsearch-access/EquipmentSearch', () => ({
  EquipmentSearch: jest.fn().mockImplementation(() => ({
    auto: mockAutoEquipment,
    find: mockFindEquipment
  }))
}));
let mockAutoEquipment = jest.fn().mockResolvedValue(found);
let mockFindEquipment = jest.fn().mockResolvedValue(found);

jest.mock('../elasticsearch-access/IngredientSearch', () => ({
  IngredientSearch: jest.fn().mockImplementation(() => ({
    auto: mockAutoIngredients,
    find: mockFindIngredients
  }))
}));
let mockAutoIngredients = jest.fn().mockResolvedValue(found);
let mockFindIngredients = jest.fn().mockResolvedValue(found);

jest.mock('../elasticsearch-access/RecipeSearch', () => ({
  RecipeSearch: jest.fn().mockImplementation(() => ({
    auto: mockAutoRecipes,
    find: mockFindRecipes
  }))
}));
let mockAutoRecipes = jest.fn().mockResolvedValue(found);
let mockFindRecipes = jest.fn().mockResolvedValue(found);

afterEach(() => {
  jest.clearAllMocks();
});

describe('search controller', () => {
  /*describe('autocompletePublicAll method', () => {

  });

  describe('findPublicAll method', () => {

  });*/

  describe('autocompletePublicEquipment method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses autoEquipment correctly', async () => {
      await searchController
        .autocompletePublicEquipment(<Request>req, <Response>res);
      expect(mockAutoEquipment).toHaveBeenCalledWith("term");
    });

    it('sends data correctly', async () => {
      await searchController
        .autocompletePublicEquipment(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await searchController
        .autocompletePublicEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('findPublicEquipment method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses findEquipment correctly', async () => {
      await searchController.findPublicEquipment(<Request>req, <Response>res);
      expect(mockFindEquipment).toHaveBeenCalledWith({someBody: "value"});
    });

    it('sends data correctly', async () => {
      await searchController.findPublicEquipment(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual =
        await searchController.findPublicEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('autocompletePublicIngredients method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses autoIngredients correctly', async () => {
      await searchController
        .autocompletePublicIngredients(<Request>req, <Response>res);
      expect(mockAutoIngredients).toHaveBeenCalledWith("term");
    });

    it('sends data correctly', async () => {
      await searchController
        .autocompletePublicIngredients(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await searchController
        .autocompletePublicIngredients(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('findPublicIngredients method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses findIngredients correctly', async () => {
      await searchController
        .findPublicIngredients(<Request>req, <Response>res);
      expect(mockFindIngredients).toHaveBeenCalledWith({someBody: "value"});
    });

    it('sends data correctly', async () => {
      await searchController
        .findPublicIngredients(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await searchController
        .findPublicIngredients(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('autocompletePublicRecipes method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses autoRecipes correctly', async () => {
      await searchController
        .autocompletePublicRecipes(<Request>req, <Response>res);
      expect(mockAutoRecipes).toHaveBeenCalledWith("term");
    });

    it('sends data correctly', async () => {
      await searchController
        .autocompletePublicRecipes(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await searchController
        .autocompletePublicRecipes(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('findPublicRecipes method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses findRecipes correctly', async () => {
      await searchController.findPublicRecipes(<Request>req, <Response>res);
      expect(mockFindRecipes).toHaveBeenCalledWith({someBody: "value"});
    });

    it('sends data correctly', async () => {
      await searchController.findPublicRecipes(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual =
        await searchController.findPublicRecipes(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });
});